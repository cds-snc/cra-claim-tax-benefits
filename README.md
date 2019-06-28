# expressbase
Express JS basic application.

### Environment
 - Node JS v12.3.1
 - NPM v6.9.0
 - GIT v2.20.1
 - Mongo DB v4.0.10
 - Redis v5.0.5

### Quick Start

1) Navigate to your project directory and run the following command ...  
`$ npm install`

2) In your app root directory create a *.env* file and copy and paste the following ...

```
# environment
NODE_ENV=development
PORT=4300

# app config
app_session_name=sid
app_session_secret=createabettersecretthanthis
app_session_resave=false
app_session_rolling=false
app_session_save_uninitialized=false
app_session_path=/
app_session_secure=false
app_session_max_age=60000
app_session_httpOnly=false

# mongo db 
mongoclient_url=mongodb://localhost:27017
mongoclient_db_name=expressbasedb_01

# redis config
redisclient_host=127.0.0.1
redisclient_port=6379
redisclient_ttl=86400

# winston 
winston_file_handleExecptions=true
winston_file_json=false
winston_file_maxsize=5242880
winston_file_maxFiles=5
winston_file_colorize=false
winston_console_level=debug
winston_console_handleExceptions=true
winston_console_json=false
winston_console_colorize=true
```


3) In your app root directory create a `logs/` directory

4) In a terminal window start the Mongo DB daemon
`$ mongod`

5) In a terminal window start the Redis daemon
`$ redis-server`

6) In a terminal window start the application
`$ npm start`
