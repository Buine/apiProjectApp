const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
var redis, db, config;

router.use(express.urlencoded({extended:false}));

router.get('/:token', (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html;  charset=utf-8" });
    res.write(`
    <form method="POST">
    <input type="hidden" name="token" value="${req.params.token}">
    <table>
    <tr>
    <th><label>New password</label></th>
    <th><input type="password" name="pass1"></th>
    </tr>
    <tr>
    <th><label>Confirm new password</label></th>
    <th><input type="password" name="pass2"></th>
    </tr>
    <tr>
    <th></th>
    <th style="text-align: end;">
        <button formaction="${req.params.token}">Change</button>
    </th>
    </tr>
    </table>
    </form>`);
    res.end();
    return;
});

router.post('/:token', async (req, res) => {
    let id = await redis.get(`${config.tokens.prefix}${req.params.token}`);
    await redis.del(`${config.tokens.prefix}${req.params.token}`);
    console.log("[User ID]:", !id ? "Token invalid" : id);
    let password = req.body.pass1;
    let password2 = req.body.pass2;
    if(password != password2) { res.send({ error: "badPassword", message: "The password not is same" }); return; }
    if(password.length < 6) { res.send({ error: "invalidInput", message: "The password is too short, minium 6 characters"}); return; }
    let user = await db.User.findOne({ where: { id } });
    if(user) {
        console.log("[Password]:", req.body.pass1);
        user.password = await bcrypt.hash(req.body.pass1, 10);
        await user.save();
    }
    res.write(!id ? "null": id);
    res.end();
    return;
});

module.exports = (redisAux, dbAux, configAux) => {
    redis = redisAux;
    db = dbAux;
    config = configAux;
    return router;
};
