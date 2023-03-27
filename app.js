const express = require('express')
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const { loadContact, findContact, addContact, duplicateCheck, deleteContact, updateContact } = require('./utils/contacts')

const app = express()
const port = 3000

// pug settings
app.set('view engine', 'pug')
app.set('views', './views')

// built in middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// konfigurasi flash 
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash());


app.get('/', (req, res) => {
    res.render('index', {
        name: 'Dicky Kamaludin Bashar', 
        title: 'Home page',
        isIndex: true
    })
})


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        isAbout: true,
        
    })
})


app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact page',
        isContact: true,
        contacts: loadContact(),
        msg: req.flash('msg')
    })
})


// form add contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: "Form Contact Data",
        isContact: true,
    })
})


// proses add contact
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = duplicateCheck(value);
        if(duplikat) {
            throw new Error('Contact name is being used!');
        }
        return true;
    }),
    check('email', 'Invalid E-mail').isEmail(),
    check('noHP', 'Invalid Nomor HP').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(400).json({errors: errors.array()})
        res.render('add-contact', {
            title: "Form Contact Data",
            isContact: true,
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        // kirim flash message
        req.flash('msg', 'Data has been added!')
        res.redirect('/contact')
    }
})


// form edit data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    res.render('edit-contact', {
        title: 'Edit Form Contact Data',
        isContact: true,
        contact: contact
    })
})


// proses ubah data contact
app.post('/contact/update', [
    body('nama').custom((value, {req}) => {
        const duplicate = duplicateCheck(value)

        if(value !== req.body.oldNama && duplicate) {
            throw new Error('Contact name is being used')
        }
        return true
    }),
    check('email', 'Invalid E-mail!').isEmail(),
    check('noHP', 'Invalid No. HP').isMobilePhone('id-ID')
], (req, res) => {
    const errors =validationResult(req)

    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Edit Form Contact Data',
            isContact: true,
            errors: errors.array(),
            contact: req.body
        })
    } else {
         updateContact(req.body)
        // kirimkan flash message
        req.flash('msg', 'Contact data has been updated!')
        res.redirect('/contact')
    }
})


// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    
    // jika contact tidak ada
    if(!contact) {
        res.status(404);
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Data has been deleted!')
        res.redirect('/contact')
    }
});


app.get('/contact/:nama', (req, res) => {
    res.render('detail', {
        title: 'Detail Contact',
        isContact: true,
        contact: findContact(req.params.nama)
    })
})


app.use('/', (req, res) => {
    res.status(404)
    res.send(`<h1>404</h1>`)
})

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})