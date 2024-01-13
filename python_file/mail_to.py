from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import json, os

import dotenv


dotenv.load_dotenv('.env')

API_KEY = os.environ['API_KEY']

# .env
# API_KEY=asdfqwerty

# system  /enc/enviroments
# user    ~/.bashrc
# session   export SESSION_VAR=777
# app       VAR=222 python app.py (print(os.getenv('VAR')

# file  setenv.sh  export VAR=342

path_log = r'/home/____/astro/post.log'
path_err = r'/home/____/astro/post.err'

with open(path_log, 'a') as log:
    log.write('start flask q\n')

with open('.env_key', 'r') as file_key:
    lines = file_key.readlines()
    for line in lines:
        try:
            val, key = line.strip().split('=')
            print(val, key, type(val), type(key))
            os.environ[val] = key
            # log = open('/home/____/astro/log.txt', 'a')
            # log.write('ok')
            # log.close()
        except ValueError:
            log = open('/home/____/astro/err_log.txt', 'a')
            log.write('errror')
            log.close()

MAIL_SERVER = os.getenv('MAIL_SERVER')
MAIL_PORT = 465                          # os.getenv('MAIL_PORT')
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

app = Flask(__name__)

app.config['MAIL_SERVER'] = MAIL_SERVER
app.config['MAIL_PORT'] = MAIL_PORT
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


@app.route("/post", methods=['POST'])
def index():

    if os.path.exists(path_log) and (os.path.getsize(path_log)) > 10 * 1024 * 1024:
        os.remove(path_log)
    if os.path.exists(path_err) and (os.path.getsize(path_err)) > 10 * 1024 * 1024:
        os.remove(path_err)

    text_key = {
        'askYourName1': 'Имя',
        'askYourMail1': 'Почта',
        'askYourTel1': 'Тел',
        'askYourDate1': 'Дата',
        'askYourAsk1': 'Вопрос',
        'agreement1': 'Согласие',
        'askYourName2': 'Имя',
        'askYourMail2': 'Почта',
        'askYourTel2': 'Тел',
        'askYourDate2': 'Дата',
        'askYourAsk2': 'Вопрос',
        'agreement2': 'Согласие',
        'askYourName': 'Имя',
        'askYourMail': 'Почта',
        'askYourTel': 'Тел',
        'askYourDate': 'Дата',
        'askYourAsk': 'Вопрос',
        'agreement': 'Согласие',
    }

    message_html = ''
    try:
        assert request.is_json
        data_js = request.get_json()

        with open(path_log, 'a') as log:
            log.write(str(data_js))

        for key in data_js:
            message_html += '<p> ' + f'{text_key[key]}: {data_js[key]}' + ' </p>'
            print(key)
            print(data_js[key])

        msg = Message('Вопрос пользователя!', sender='____@mail.ru', recipients=['____@mail.ru'])
        msg.html = message_html
        mail.send(msg)

        with open(path_log, 'a', encoding='utf-8') as log:
            log.write(str(data_js) + '\n')

        response = jsonify({'send': 'ok'})
        return response

    except Exception as e:
        print(f'EEEError {e=}, {type(e)=}')

        msg = Message('ERROR SITE!!!!!!!', sender='____@mail.ru', recipients=['____@mail.ru'])
        msg.body = f' EEEError {e=}  {type(e)=} \n'
        mail.send(msg)

        with open(path_err, 'a', encoding='utf-8') as log:
            log.write(f'Error {e=}, {type(e)=}' + '\n')

        response = jsonify({'send': 'error'})
        response.status_code = 400
        return response


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
    pass
