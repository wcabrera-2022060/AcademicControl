import { firstAdmin } from './configs/admin.js'
import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'


initServer()
connect()
firstAdmin()