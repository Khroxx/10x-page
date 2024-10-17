# 10x-page

1. clone repository:
```bash
git clone https://github.com/Khroxx/10x-page.git
```

2. create DATABASE:
```bash
CREATE DATABASE texsib_projekt;
CREATE USER 'test'@'localhost' IDENTIFIED BY 'testpassword';
GRANT ALL PRIVILEGES ON texsib_projekt.* TO 'test'@'localhost';
FLUSH PRIVILEGES;
```
```bash
EXIT;
```

3. install:
```bash
cd 10x-page/
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
flask db init
flask db migrate -m "first migration"
flask db upgrade
python run.py
```
The Server is now up and running 
