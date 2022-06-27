//----Requerimentos

require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express();
const user = require('./models/user')

app.use(express.json());

//----------------------------------------------------------------------------------------------------------
//----Usuario

app.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    // validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
  
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
  
    if (!password) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
    
//---------------------------------------------------------------------------------------------------------

    const userExists = await user.findOne({ email: email })

    if(userExists) {
        return res.status(422).json({ message: 'Já existe' })
    }

//---------------------------------------------------------------------------------------------------------

    const salt = await bcrypt.genSalt(12)
    password = await bcrypt.hash(passord, salt)

    const user = new user({
        name, email, password,
    })

    try {
        await user.save()
        console.log('Deu bom!!!')
    } catch(error) {
        console.log('Deu ruim!!!')
    }
})

//---------------------------------------------------------------------------------------------------------
//----Login

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body
    if(!email) {
        return res.status(422).json({ message: 'O campo email deve ser preenchido!'})
    }if(!password) {
        return res.status(422).json({ message: 'O campo senha deve ser preenchido!'})
    }

    const userExists = await user.findOne({ email: email })
    if(!user) {
        return res.status(422).json({ message: 'Não existe' })
    } 
})

//---------------------------------------------------------------------------------------------------------
//----Variaveis do Banco de Dados

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

//----Conectando ao Banco de Dados

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.5xiopf6.mongodb.net/?retryWrites=true&w=majority`
).then(() => {
    app.listen(3000)
    console.log('Banco de Dados Conectado!')
}).catch((err) => console.log(err))
