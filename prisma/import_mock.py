import json
import sqlite3

# Load the JSON data
with open('MockSessionData.json', 'r') as file:
    data = json.load(file)

# Connect to SQLite database (assuming the database is named 'database.db')
conn = sqlite3.connect('dev.db')
cursor = conn.cursor()

# Insert session data
session = data
cursor.execute("INSERT INTO Session (id, createdAt, updatedAt, sessionType, trackId, sessionDuration, pitSpeedLimit, networkGame, forecastAccuracy, aiDifficulty, seasonLinkIdentifier, weekendLinkIdentifier, sessionLinkIdentifier, totalLaps, bestLapNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (session['id'], session['createdAt'], session['updatedAt'], session['sessionType'], session['trackId'], session['sessionDuration'], session['pitSpeedLimit'], session['networkGame'], session['forecastAccuracy'], session['aiDifficulty'], session['seasonLinkIdentifier'], session['weekendLinkIdentifier'], session['sessionLinkIdentifier'], session['totalLaps'], session['bestLapNum']))

# Insert laps and car setups
for lap in session['laps']:
    cursor.execute("INSERT INTO Lap (id, createdAt, updatedAt, lapTimeInMS, sector1TimeInMS, sector2TimeInMS, sector3TimeInMS, sessionId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (lap['id'], lap['createdAt'], lap['updatedAt'], lap['lapTimeInMS'], lap['sector1TimeInMS'], lap['sector2TimeInMS'], lap['sector3TimeInMS'], lap['sessionId']))
    car_setup = lap['carSetup']
    cursor.execute("INSERT INTO CarSetup (id, createdAt, updatedAt, frontWing, rearWing, onThrottle, offThrottle, frontCamber, rearCamber, frontToe, rearToe, frontSuspension, rearSuspension, frontAntiRollBar, rearAntiRollBar, frontSuspensionHeight, rearSuspensionHeight, brakePressure, brakeBias, frontTyrePressure, rearTyrePressure, ballast, fuelLoad, lapId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (car_setup['id'], car_setup['createdAt'], car_setup['updatedAt'], car_setup['frontWing'], car_setup['rearWing'], car_setup['onThrottle'], car_setup['offThrottle'], car_setup['frontCamber'], car_setup['rearCamber'], car_setup['frontToe'], car_setup['rearToe'], car_setup['frontSuspension'], car_setup['rearSuspension'], car_setup['frontAntiRollBar'], car_setup['rearAntiRollBar'], car_setup['frontSuspensionHeight'], car_setup['rearSuspensionHeight'], car_setup['brakePressure'], car_setup['brakeBias'], car_setup['frontTyrePressure'], car_setup['rearTyrePressure'], car_setup['ballast'], car_setup['fuelLoad'], car_setup['lapId']))

# Commit changes and close the connection
conn.commit()
conn.close()
