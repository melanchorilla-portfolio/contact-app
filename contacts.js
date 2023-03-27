const fs = require('fs')
const chalk = require('chalk')
const validator = require('validator')


// membuat folder jika tidak ada
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// membuat file contacts.json jika tidak tersedia
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// membaca isi data contact.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}


const simpanContact = (nama, email, noHP) => {
    const contact = {nama, email, noHP}

    const contacts = loadContact()

    // cek duplikat
    const duplikat = contacts.find(contact => contact.nama === nama)
    if (duplikat) {
        console.log(chalk.red.inverse.bold('Kontak sudah terdaftar, gunakan nama lain!'))
        return false
    }

    // cek email
    if (email) {
        if (!validator.isEmail(email)) {
            console.log(chalk.red.inverse.bold('E-mail tidak valid!'))
            return false
        }
    }

    // cek no.HP
    if (!validator.isMobilePhone(noHP, 'id-ID')) {
        console.log(chalk.red.inverse.bold('Nomor HP tidak valid!'))
    }

    contacts.push(contact)

    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))

    console.log(chalk.green.inverse.bold("Data disimpan"))
}

const listContact = () => {
    const contacts = loadContact()
    console.log(chalk.blue.inverse.bold("Daftar Kontak: "))

    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.nama} - ${contact.noHP}`)
    })

}

const detailContact = (nama) => {
    const contacts = loadContact()

    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())

    if (!contact) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan`))
    }

    console.log(chalk.blue.inverse.bold(contact.nama))
    console.log(contact.noHP)

    if (contact.email) {
        console.log(contact.email)
    }
}

const deleteContact = (nama) => {
    const contacts = loadContact()
    const newContacts = contacts.filter(
        contact => contact.nama.toLowerCase() !== nama.toLowerCase()
    )

    // compare contact lama dengan contact baru
    if (contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(`${nama} tidak ditemukan!`))
        return false
    }

    fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts))

    console.log(chalk.green.inverse.bold(`Data ${nama} berhasil dihapus!`))
}


module.exports = {simpanContact, listContact, detailContact, deleteContact}