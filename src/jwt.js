const jwt = require("jsonwebtoken");
const generateWebtoken = async () => {
    try {
        const payload = {
            id: 9548582343
        }
        const secretKey = "Hellomynameisabhisheknegi"
        const token = await jwt.sign(payload, secretKey);
        console.log(token);
        const verification = jwt.verify(token,secretKey);
        console.log(verification);
    }
    catch (err) {
        console.log(err);
    }
}
generateWebtoken()