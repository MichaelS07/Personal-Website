#!/usr/bin/env python3
"""Assemble the episode from the voiceover.

Reads assets/vo/lineNN.wav (+ optional lineNN.words.json from `hyperframes transcribe`),
aligns the transcript to the script text, then:
  - writes index.html from tools/index.template.html (scene hosts, audio, chapters)
  - injects scene-local word timings into each compositions/frames/*.html between /*W*/ markers
  - writes compositions/captions.html
Run from the project root: python3 tools/build.py
"""
import difflib, json, re, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEAD = 0.5   # silence before the VO starts in each scene
TAIL = 0.7   # hold after the VO ends

SCENES = [
    ("01-hook", "The hook"),
    ("02-plan", "The plan"),
    ("03-problem", "Is it a problem?"),
    ("04-formula", "How CPC is set"),
    ("05-competition", "Cause 1 · Competition"),
    ("06-quality-score", "Cause 2 · Quality Score"),
    ("07-bidding", "Cause 3 · Your bidding"),
    ("08-search-terms", "Cause 4 · Search terms"),
    ("09-seasonality", "Cause 5 · Seasonality"),
    ("10-tracking", "Cause 6 · Tracking"),
    ("11-checklist", "The 15-min checklist"),
    ("12-outro", "Recap"),
]


def norm(w):
    return re.sub(r"[^a-z0-9%]", "", w.lower())


def wav_dur(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def script_lines():
    t = (ROOT / "SCRIPT.md").read_text()
    return [l[4:] for l in t.splitlines() if l.startswith("    ")]


def load_asr(p):
    """Return [(word, start, end)] from a transcribe JSON, tolerant of shape."""
    if not p.exists():
        return None
    d = json.loads(p.read_text())
    words = []

    def walk(o):
        if isinstance(o, dict):
            w = o.get("word") or o.get("text")
            s = o.get("start", o.get("t0"))
            e = o.get("end", o.get("t1"))
            if isinstance(w, str) and isinstance(s, (int, float)) and isinstance(e, (int, float)) and " " not in w.strip():
                words.append((w.strip(), float(s), float(e)))
                return
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(d)
    return words or None


def proportional(tokens, dur):
    """Fallback timing: by characters, with extra weight after punctuation."""
    weights = []
    for t in tokens:
        w = len(t) + 1.5
        if t[-1:] in ".?!":
            w += 7
        elif t[-1:] in ",:;":
            w += 3
        weights.append(w)
    total = sum(weights)
    out, acc = [], 0.0
    for t, w in zip(tokens, weights):
        out.append((acc / total) * dur)
        acc += w
    return out


def silences(wavp):
    import subprocess
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(wavp), "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", r.stderr)]
    return list(zip(st, en))


def by_pauses(tokens, dur, wavp):
    """Kokoro pauses at sentence ends: map sentences onto the speech between silences."""
    sents, cur = [], []
    for k, t in enumerate(tokens):
        cur.append(k)
        if t[-1:] in ".?!" or k == len(tokens) - 1:
            sents.append(cur)
            cur = []
    sil = [s for s in silences(wavp) if s[0] > 0.05 and s[1] < dur - 0.05]
    est = proportional(tokens, dur)
    # choose, for each internal sentence boundary, the silence nearest its estimate (monotonic)
    bounds, used = [], -1
    for si in range(len(sents) - 1):
        nxt_tok = sents[si + 1][0]
        e = est[nxt_tok]
        best, bi = None, None
        for j in range(used + 1, len(sil)):
            dd = abs(sil[j][1] - e)
            if best is None or dd < best:
                best, bi = dd, j
        if bi is not None and best < 4.0:
            bounds.append((sil[bi][0], sil[bi][1]))
            used = bi
        else:
            bounds.append(None)
    # segments
    starts, ends, prev_end = [], [], 0.0
    lead = sil[0][1] if False else 0.0
    for si, sent in enumerate(sents):
        s0 = prev_end
        b = bounds[si] if si < len(bounds) else None
        if si == len(sents) - 1:
            s1 = dur
        elif b:
            s1 = b[0]
        else:
            s1 = s0 + (est[sents[si + 1][0]] - est[sent[0]])
        starts.append(s0)
        ends.append(s1)
        prev_end = b[1] if b else s1
    times = [0.0] * len(tokens)
    for sent, s0, s1 in zip(sents, starts, ends):
        sub = [tokens[k] for k in sent]
        local = proportional(sub, max(0.2, s1 - s0))
        for k, tm in zip(sent, local):
            times[k] = s0 + tm
    return times


def align(tokens, asr, dur, wavp=None):
    """Map each script token to a start time using the ASR words."""
    if not asr:
        return by_pauses(tokens, dur, wavp) if wavp else proportional(tokens, dur)
    a = [norm(w) for w, _, _ in asr]
    s = [norm(t) for t in tokens]
    sm = difflib.SequenceMatcher(None, s, a, autojunk=False)
    times = [None] * len(tokens)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = asr[blk.b + k][1]
    # interpolate gaps
    known = [(i, t) for i, t in enumerate(times) if t is not None]
    if not known:
        return proportional(tokens, dur)
    known = [(-1, 0.0)] + known + [(len(tokens), dur)]
    for (i0, t0), (i1, t1) in zip(known, known[1:]):
        for i in range(i0 + 1, i1):
            times[i] = t0 + (t1 - t0) * (i - i0) / (i1 - i0)
    return times


def main():
    lines = script_lines()
    assert len(lines) == len(SCENES), (len(lines), len(SCENES))
    vo = ROOT / "assets" / "vo"
    t = 0.0
    hosts, audio, chapters, ch_js, caps = [], [], [], [], []
    for i, ((slug, chap), text) in enumerate(zip(SCENES, lines), 1):
        wavp = vo / f"line{i:02d}.wav"
        d = wav_dur(wavp)
        tokens = text.split()
        times = align(tokens, load_asr(vo / f"line{i:02d}.words.json"), d, wavp)
        sdur = round(LEAD + d + TAIL, 2)
        cid = f"s{i:02d}"
        hosts.append(
            f'      <div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/frames/{slug}.html" '
            f'data-start="{t:.2f}" data-duration="{sdur:.2f}" data-track-index="{i % 2 + 1}" data-width="1920" data-height="1080"></div>'
        )
        audio.append(
            f'      <audio id="vo{i:02d}" src="assets/vo/line{i:02d}.wav" data-start="{t + LEAD:.2f}" '
            f'data-duration="{d:.2f}" data-track-index="30" data-volume="1"></audio>'
        )
        chapters.append(f'            <div class="chapter" id="chapter-{i - 1}">{chap}</div>')
        ch_js.append([round(t, 2), chap])
        # scene-local word timings
        W = [[norm(tok), round(LEAD + tm, 2)] for tok, tm in zip(tokens, times)]
        f = ROOT / "compositions" / "frames" / f"{slug}.html"
        if f.exists():
            src = f.read_text()
            src = re.sub(r"/\*W\*/.*?/\*/W\*/", "/*W*/" + json.dumps(W, separators=(",", ":")) + "/*/W*/", src, flags=re.S)
            src = re.sub(r'data-duration="[0-9.]+"(?=[^>]*id="root")|(?<=id="root" )data-duration="[0-9.]+"', f'data-duration="{sdur:.2f}"', src)
            src = re.sub(r"const DUR = [0-9.]+;", f"const DUR = {sdur:.2f};", src)
            f.write_text(src)
        # captions: chunk at punctuation or 7 words
        chunk, cstart = [], None
        for k, (tok, tm) in enumerate(zip(tokens, times)):
            if not chunk:
                cstart = tm
            chunk.append(tok)
            end_here = tok[-1:] in ".?!,:;" and len(chunk) >= 3 or len(chunk) >= 7 or k == len(tokens) - 1
            if end_here:
                nxt = times[k + 1] if k + 1 < len(times) else d + 0.3
                caps.append((t + LEAD + cstart, t + LEAD + nxt, " ".join(chunk)))
                chunk = []
        t += sdur
    total = round(t, 2)

    tpl = (ROOT / "tools" / "index.template.html").read_text()
    out = (
        tpl.replace("__TOTAL__", f"{total:.2f}")
        .replace("<!--SCENES-->", "\n".join(hosts))
        .replace("<!--AUDIO-->", "\n".join(audio))
        .replace("<!--CHAPTERS-->", "\n".join(chapters))
        .replace("/*CH*/[]/*/CH*/", json.dumps(ch_js))
        .replace(
            "<!--CAPTIONS-->",
            f'      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" '
            f'data-start="0" data-duration="{total:.2f}" data-track-index="21" data-track-kind="captions" data-width="1920" data-height="1080"></div>',
        )
    )
    (ROOT / "index.html").write_text(out)
    for name in ("bg", "chrome"):
        s = (ROOT / "tools" / f"{name}.template.html").read_text()
        s = s.replace("__TOTAL__", f"{total:.2f}").replace("<!--CHAPTERS-->", "\n".join(chapters)).replace("/*CH*/[]/*/CH*/", json.dumps(ch_js))
        (ROOT / "compositions" / f"{name}.html").write_text(s)
    write_captions(caps, total)
    print(f"total {total:.2f}s ({total / 60:.2f} min), {len(caps)} caption cues")
    for (slug, _), h in zip(SCENES, hosts):
        print(slug, re.search(r'data-start="([0-9.]+)" data-duration="([0-9.]+)"', h).groups())


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def write_captions(caps, total):
    cues = "\n".join(f'        <div class="cap" id="cap-{n}"><span>{esc(c[2])}</span></div>' for n, c in enumerate(caps))
    timing = json.dumps([[round(a, 2), round(b, 2)] for a, b, _ in caps])
    html = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        #root {{ position: absolute; inset: 0; pointer-events: none; }}
        #captions-rail {{ position: absolute; left: 240px; right: 240px; bottom: 56px; height: 96px; }}
        .cap {{ position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; }}
        .cap span {{ display: inline-block; max-width: 1440px; text-align: center; font-family: "Inter", sans-serif; font-weight: 700; font-size: 38px; line-height: 1.25; color: #edf3ef; background: rgba(4, 10, 7, 0.82); border-radius: 14px; padding: 12px 28px; }}
      </style>
      <div id="root" data-composition-id="captions" data-width="1920" data-height="1080">
        <div id="captions-rail">
{cues}
        </div>
      </div>
      <script>
        (function () {{
        const C = {timing};
        const tl = gsap.timeline({{ paused: true }});
        C.forEach(function (c, i) {{
          tl.set("#cap-" + i, {{ opacity: 1 }}, c[0]);
          tl.set("#cap-" + i, {{ opacity: 0 }}, c[1]);
        }});
        tl.set({{}}, {{}}, {total:.2f});
        window.__timelines["captions"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""
    (ROOT / "compositions" / "captions.html").write_text(html)


if __name__ == "__main__":
    main()
