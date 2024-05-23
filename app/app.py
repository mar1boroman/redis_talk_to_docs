import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    message = request.json.get('message')
    print(f"Received message: {message}")  # Display the message on the terminal
    response = "hello"
    return jsonify(reply=response)

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist('files')
    filenames = []
    for file in files:
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        filenames.append(filename)
    
    # Notify the user via the chatbot that files were uploaded
    response_message = f"The following files were uploaded: {', '} ".join(filenames)
    return jsonify(filenames=filenames, message=response_message)

if __name__ == '__main__':
    app.run(debug=True)