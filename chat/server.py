import socketio

manager = socketio.AsyncRedisManager("redis://localhost:6379/0")
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*", client_manager=manager)
# sio = socketio.AsyncServer()
sio = socketio.Server(cors_allowed_origins="*")

@sio.event
async def connect(sid, environ):
    print('Connection established:', sid, environ)

@sio.on("")
async def new(sid, environ):
    print('connection established', sid, environ)

@sio.on("connect")
async def new(sid, environ):
    print('connection established', sid, environ)

@sio.event
def my_message(data):
    print('message received with ', data)
    sio.emit('my response', {'response': 'my response'})

@sio.event
def disconnect():
    print('disconnected from server')

