const yargs = require('yargs')
const contacts = require('./contacts')

yargs.command({
    command: 'add',
    describe: 'Menambahkan contact baru',
    builder: {
        nama: {
            describe: "Nama lengkap",
            demandOption: true,
            type: 'string'
        },
        email: {
            describe: "E-mail",
            demandOption: false,
            type: 'string'
        },
        noHP: {
            describe: "Nomor HP",
            demandOption: true,
            type: 'string' 
        }
    },
    handler(argv) {
        contacts.simpanContact(argv.nama, argv.email, argv.noHP)
    }
}).demandCommand()

yargs.command({
    command: 'list',
    describe: 'Menampilkan semua nama dan nomor HP kontak',
    handler() {
        contacts.listContact()
    }
})


// menampilkan detail sebuah contact
yargs.command({
    command: 'detail',
    describe: 'Menampilkan sebuah contact berdasarkan nama',
    builder: {
        nama: {
            describe: "Nama lengkap",
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        contacts.detailContact(argv.nama);
    },
});


// menghapus contact berdasarkan nama
yargs.command({
    command: 'delete',
    describe: 'Menghapus contact berdasarkan nama',
    builder: {
        nama: {
            describe: "Nama lengkap",
            demandOption: true,
            type: 'string'
        },
    },
    handler(argv) {
        contacts.deleteContact(argv.nama);
    },
});

yargs.parse()
