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
pipenv install
pipenv shell
flask db init
flask db migrate -m "first migration"
flask db upgrade
python run.py
```
The Server is now up and running 

3. Run tests with pytest
```bash 
pytest -s app/test.py
```
and/or check coverage:
```bash
pytest --cov=app -v
```