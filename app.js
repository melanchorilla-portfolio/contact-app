const contacts = require('./contacts')

const main = async () => {
    const nama = await contacts.tulisPertanyaan('Masukkan Nama Anda: ')
    const email = await contacts.tulisPertanyaan('Masukkan E-mail Anda: ')
    const noHP = await contacts.tulisPertanyaan('Masukkan no. HP Anda: ')

    contacts.simpanContact(nama, email, noHP)
}

main()