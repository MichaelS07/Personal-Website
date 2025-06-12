
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os

class ContactHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/contact':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            form_data = urllib.parse.parse_qs(post_data.decode('utf-8'))
            
            # Extract form fields
            name = form_data.get('name', [''])[0]
            email = form_data.get('email', [''])[0]
            company = form_data.get('company', [''])[0]
            message = form_data.get('message', [''])[0]
            
            # Send email (you'll need to configure SMTP settings)
            try:
                self.send_email(name, email, company, message)
                response = {'status': 'success', 'message': 'Message sent successfully!'}
            except Exception as e:
                response = {'status': 'error', 'message': 'Failed to send message. Please try again.'}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_email(self, name, email, company, message):
        # Configure these with your email settings
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "your-email@gmail.com"  # Replace with your email
        sender_password = "your-app-password"  # Replace with your app password
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = sender_email
        msg['Subject'] = f"New Contact Form Submission from {name}"
        
        body = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        Company: {company}
        Message: {message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), ContactHandler)
    print("Contact form server running on port 8080")
    server.serve_forever()
