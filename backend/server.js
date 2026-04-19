import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

// 👇 IMPORTANTE
import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'

dotenv.config()

console.log('CLIENT ID:', process.env.GOOGLE_CLIENT_ID)
const app = express()
app.use(cors())
app.use(express.json())

// 🔐 GOOGLE CLIENT
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// 🔌 CONEXIÓN MYSQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendita'
})

db.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err)
    } else {
        console.log('Conectado a MySQL')
    }
})

// 📦 PRODUCTOS
app.get('/api/productos', (req, res) => {
    const sql = `
    SELECT p.*, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
  `

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message })

        const productos = results.map(p => ({
            id: p.id,
            name: p.nombre,
            category: p.categoria,
            price: p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio,
            description: p.descripcion,
            emoji: '🛒'
        }))

        res.json(productos)
    })
})

// 🔐 LOGIN NORMAL
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body

    const sql = 'SELECT * FROM usuarios WHERE correo = ? AND password = ?'

    db.query(sql, [correo, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })

        if (results.length > 0) {
            res.json({ ok: true, usuario: results[0] })
        } else {
            res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' })
        }
    })
})

// 📝 REGISTRO
app.post('/api/register', (req, res) => {
    const { nombre, correo, password } = req.body

    if (!nombre || !correo || !password) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Todos los campos son obligatorios'
        })
    }

    const checkSql = 'SELECT * FROM usuarios WHERE correo = ?'

    db.query(checkSql, [correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })

        if (results.length > 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario ya existe'
            })
        }

        const insertSql = `
      INSERT INTO usuarios (nombre, correo, password)
      VALUES (?, ?, ?)
    `

        db.query(insertSql, [nombre, correo, password], (err) => {
            if (err) return res.status(500).json({ error: err.message })

            res.json({
                ok: true,
                mensaje: 'Usuario registrado correctamente'
            })
        })
    })
})


// 🔥 GOOGLE LOGIN (LO QUE TE FALTABA)
app.post('/api/google-login', async (req, res) => {
    try {
        const { credential } = req.body

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        const nombre = payload.name
        const correo = payload.email

        const sql = 'SELECT * FROM usuarios WHERE correo = ?'

        db.query(sql, [correo], (err, results) => {
            if (err) return res.status(500).json({ error: err.message })

            if (results.length > 0) {
                return res.json({ ok: true, usuario: results[0] })
            }

            const insert = `
                INSERT INTO usuarios (nombre, correo, password)
                VALUES (?, ?, 'google')
            `

            db.query(insert, [nombre, correo], (err) => {
                if (err) return res.status(500).json({ error: err.message })

                res.json({
                    ok: true,
                    usuario: { nombre, correo }
                })
            })
        })

    } catch (error) {
        console.error(error)
        res.status(401).json({ ok: false, mensaje: 'Token inválido' })
    }
})


// 🚀 SERVIDOR
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001')
})