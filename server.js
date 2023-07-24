const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send(`<h1 style="text-align: center;"><span style="color: #ff00ff;"><span style="color: #000000;"><strong>Sbeves Site&nbsp;</strong></span><br /></span></h1>
<h4 style="text-align: center;"><span style="color: #ff00ff;"><em><span style="color: #0000ff;">By: desi#4049</span></em><br /></span></h4>
<h4 style="text-align: left;"><span style="color: #ff00ff;"><span style="color: #0000ff;"><strong><span style="color: #000000;">Sbeve is a discord bot created by desi#4049. Sbeve is in over 80 servers and has a bunch of commands. Sbeve has hundreds of commands and to see them all you can say E!commands. The prefix of sbeve is 'E!' and if you have any questions join sbeve's discord server. If you would like to invite sbeve or join the server<br /><span style="color: #ff00ff;">C</span><span style="color: #ff9900;">l<span style="color: #ffff00;">i</span></span><span style="color: #ff0000;">c<span style="color: #0000ff;">k</span></span> <span style="color: #00ff00;">B</span><span style="color: #000080;">e</span><span style="color: #ff99cc;">l</span><span style="color: #ff00ff;">o<span style="color: #ccffff;">w</span></span>!</span><br /><br /><br /><br /></strong></span><br /></span></h4> <input type="button" onclick="location.href='https://discord.com/api/oauth2/authorize?client_id=842032435318489108&permissions=0&scope=bot';" value="Invite Sbeve" <p> <input type="button" onclick="location.href='https://discord.gg/GkFE9xD7vr';" value="Join Support Server" </p> `)

})
function keepAlive(){
    server.listen(1, ()=>{console.log("Server is Ready! bruh moment")});
}
module.exports = keepAlive;