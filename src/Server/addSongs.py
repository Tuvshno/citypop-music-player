import os
import mysql.connector

# Connect to the database
mydb = mysql.connector.connect(
    host="localhost",        # Usually localhost
    user="root",     # Enter your MySQL username
    password="Icanownu123", # Enter your MySQL password
    database="citypop"       # Database name
)

mycursor = mydb.cursor()

# The directory where the song files are
directory = r'D:\citypop'

# List all files in the directory
for filename in os.listdir(directory):
    # Ensure that it's actually a file and not a directory
    if os.path.isfile(os.path.join(directory, filename)):
        # Remove the file extension (assuming .mp3)
        filename_without_ext = os.path.splitext(filename)[0]
        # Parse the filename
        split_filename = filename_without_ext.split(" - ")
        artist = split_filename[0]
        # Extract the song name and year from the second part
        song_info = split_filename[1].rsplit(" (", 1)
        song_name = song_info[0]
        year = song_info[1][:-1]  # Remove the closing parenthesis

        # Add the parsed info to the database
        sql = "INSERT INTO songs (artist, title, date) VALUES (%s, %s, %s)"
        val = (artist, song_name, year)
        print(artist + " " + song_name + " " + year)
        mycursor.execute(sql, val)

# # Commit the changes
mydb.commit()
