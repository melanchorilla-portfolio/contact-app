const fs = require('fs')

// membuat folder jika tidak ada
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// membuat file contacts.json jika tidak ada
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// membaca isi semua data contacts.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)

    return contacts
}

// menuliskan / menimpa file contacts.json dengan data baru
const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContact(contacts)
}

// cek nama yang duplikat
const duplicateCheck = (nama) => {
    const contacts = loadContact()
    return contacts.find(contact => contact.nama == nama)
}

// ambil data berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    
    return contact
}

// hapus contact
const deleteContact = (nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

    saveContact(filteredContacts);
}

// mengubah contact
const updateContact = (newContact) => {
    const contacts = loadContact();
    // hilangkan contact lama yang namanya sama dengan oldNama
    const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldNama);

    delete newContact.oldNama;

    filteredContacts.push(newContact);
    saveContact(filteredContacts);
}


module.exports = { loadContact, findContact, addContact, duplicateCheck, deleteContact, updateContact }