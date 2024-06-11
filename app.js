const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, AkunUser, profil} = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3002;
const secretKey = 'myKey';

app.use(bodyParser.json());

// middleware untuk autentikasi
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next()
        });
    } else {
        res.sendStatus(401)
    }
};

// Register User
app.post('./register', async (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await AkunUser.ceate({ email, password: hashedPassword});
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.massage });
    }
});


// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await AkunUser.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ error: 'email atau password tidak valid!' });
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(400).json({ error: 'email atau password tidak valid!' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Profil Baru
  app.post('/profils', authenticateJWT, async (req, res) => {
    const { akunUser_id, poto, nama, alamat, pesan_untuk_masa_depan } = req.body;
  
    try {
      const profil = await Profil.create({ akunUser_id, poto, nama, alamat, pesan_untuk_masa_depan });
      res.status(201).json(profil);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // mendapatkan semua profil
  app.get('/profils', authenticateJWT, async (req, res) => {
    const profils = await Profil.findAll();
    res.json(profils);
  });
  
  // mendapatkan id pofil
  app.get('/profils/:id', authenticateJWT, async (req, res) => {
    const profil = await Profil.findByPk(req.params.id);
  
    if (!profil) {
      return res.status(404).json({ error: 'profil not found' });
    }
  
    res.json(profil);
  });
  
  // mempebarui profil
  app.put('/profils/:id', authenticateJWT, async (req, res) => {
    const { poto, nama, alamat, pesan_untuk_masa_depan } = req.body;
  
    try {
      const profil = await Profil.findByPk(req.params.id);
  
      if (!profil) {
        return res.status(404).json({ error: 'profil not found' });
      }
  
      profil.poto = poto;
      profil.nama = nama;
      profil.alamat = alamat;
      profil.pesan_untuk_masa_depan = pesan_untuk_masa_depan;
      await profil.save();
  
      res.json(profil);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete a profil by ID (protected route)
  app.delete('/profils/:id', authenticateJWT, async (req, res) => {
    const profil = await Profil.findByPk(req.params.id);
  
    if (!profil) {
      return res.status(404).json({ error: 'profil not found' });
    }
  
    await profil.destroy();
    res.status(204).send();
  });
  
  // Sync database and start server
  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });





  //id|email            |password   |
//--+-----------------+-----------+
//8|akun1@example.com|password123|
//9|akun2@example.com|password123|
//10|akun3@example.com|password123|