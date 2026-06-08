import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, flash, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "super_secret_key"
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'pdf'}

# Ensure folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            upload_date TEXT NOT NULL,
            filepath TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/files')
def get_files():
    conn = get_db_connection()
    docs = conn.execute('SELECT * FROM documents ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(doc) for doc in docs])

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to prevent clobbering
        unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Save to DB
        conn = get_db_connection()
        conn.execute('INSERT INTO documents (filename, upload_date, filepath) VALUES (?, ?, ?)',
                     (filename, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), f"/download/{unique_filename}"))
        conn.commit()
        conn.close()
        
        return jsonify({'success': 'File uploaded successfully!', 'filename': filename})
    
    return jsonify({'error': 'Invalid file type. Only JPG, PNG, PDF allowed.'}), 400

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    init_db()
    # Note: AI Studio environment requires 0.0.0.0:3000
    app.run(host='0.0.0.0', port=3000, debug=True)
