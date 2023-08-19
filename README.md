Aurora API Discord Bot Example

Welcome to the Aurora API Discord bot example! This bot demonstrates various commands and functionalities that you can implement using the Aurora API. Make sure to follow the instructions below to set up and configure the bot correctly.
Command List

    addfile:
    Add a new file to your panel.

    addtime:
    Add time to licenses already used (days).

    addvar:
    Add a new variable to your panel.

    createlicense:
    Create a new license key.

    deletefile:
    Delete an existing file from your panel.

    deletelicense:
    Delete an existing license from your panel.

    deletevar:
    Delete an existing variable from your panel.

    editfilelink:
    Edit an existing file URL link.

    editvar:
    Edit the return of an existing variable.

    setsecret:
    Set your secret key for the API, found in profile settings.

    unique:
    Generate a random license in the format "random(15)-Aurora-random(15)". For example: random(15)-Aurora-random(15).

    updatenote:
    Update the current note of an existing license key.

Setup Instructions

    Bot Token: Add your bot token to the .env file by pasting it after token=your_token_key.

    MySQL Configuration: In the .env file, you will find fields for host, user, password, database, and port. Update these fields with your MySQL database information. This database is used to store the secret key for your guild.

    Secret Key: To securely store your secret key, the example uses a MySQL database. If you want to hardcode your secret key instead, you can replace instances like guildSecretResult[0].secret_key in the code with your actual secret key. Remember to make this change in each .js command that requires the secret key.

    Console Log: Modify the console log message after login in the ready.js file. Update the line console.log(successfully logged in as ${client.user.tag}!); with your desired log message.

Usage

Once you have set up the bot according to the instructions above, you can invite it to your Discord server and start using the commands. Each command performs a specific action related to the Aurora API.

For any questions or assistance, feel free to reach out to us https://uixdesign.xyz.

Happy botting! 🤖
