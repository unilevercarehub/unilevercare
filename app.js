/* =========================================================
   RUANG KELUHAN KONSUMEN
   APP.JS
   Versi tanpa Supabase
   Data disimpan di browser (localStorage)
   ========================================================= */


/* =========================================================
   KONFIGURASI
   ========================================================= */

const STORAGE_KEY = "ruang_keluhan_data";

const TICKET_PREFIX = "UKC";


/* =========================================================
   DATABASE LOCAL
   ========================================================= */

function getComplaints() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Gagal membaca data:",
            error
        );

        return [];
    }
}


function saveComplaints(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   NOMOR TIKET
   ========================================================= */

function generateTicketNumber() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");


    const complaints = getComplaints();

    const number =
        String(
            complaints.length + 1
        ).padStart(4, "0");


    return `${TICKET_PREFIX}-${year}${month}${day}-${number}`;
}


/* =========================================================
   FORMAT TANGGAL
   ========================================================= */

function formatDate(date) {

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            dateStyle: "long",
            timeStyle: "short"
        }
    ).format(
        new Date(date)
    );
}


/* =========================================================
   FORMAT FILE
   ========================================================= */

function formatFileSize(bytes) {

    if (!bytes) {
        return "0 KB";
    }

    const kb = bytes / 1024;

    if (kb < 1024) {

        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    return `${mb.toFixed(2)} MB`;
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FILE → BASE64
   ========================================================= */

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = () => {

                resolve(
                    reader.result
                );
            };

            reader.onerror = () => {

                reject(
                    new Error(
                        "Gagal membaca file."
                    )
                );
            };

            reader.readAsDataURL(file);
        }
    );
}


/* =========================================================
   FORM PENGADUAN
   ========================================================= */

const complaintForm =
    document.getElementById(
        "complaintForm"
    );


if (complaintForm) {

    const fileInput =
        document.getElementById(
            "bukti"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );

    const submitButton =
        document.getElementById(
            "submitComplaint"
        );

    const formMessage =
        document.getElementById(
            "formMessage"
        );


    /* -----------------------------------------------------
       FILE NAME
       ----------------------------------------------------- */

    if (fileInput) {

        fileInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];

                if (!file) {

                    fileName.textContent =
                        "";

                    return;
                }


                fileName.textContent =
                    `${file.name} • ${formatFileSize(file.size)}`;
            }
        );
    }


    /* -----------------------------------------------------
       SUBMIT
       ----------------------------------------------------- */

    complaintForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            formMessage.className =
                "form-message";

            formMessage.textContent =
                "";


            /* Ambil data */

            const nama =
                document.getElementById(
                    "nama"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const telepon =
                document.getElementById(
                    "telepon"
                ).value.trim();

            const kategori =
                document.getElementById(
                    "kategori"
                ).value;

            const judul =
                document.getElementById(
                    "judul"
                ).value.trim();

            const deskripsi =
                document.getElementById(
                    "deskripsi"
                ).value.trim();

            const agreement =
                document.getElementById(
                    "agreement"
                ).checked;

            const file =
                fileInput &&
                fileInput.files
                    ? fileInput.files[0]
                    : null;


            /* Validasi */

            if (!nama ||
                !email ||
                !telepon ||
                !kategori ||
                !judul ||
                !deskripsi) {

                showFormMessage(
                    "Mohon lengkapi semua data yang wajib diisi.",
                    "error"
                );

                return;
            }


            if (!agreement) {

                showFormMessage(
                    "Silakan menyetujui pernyataan terlebih dahulu.",
                    "error"
                );

                return;
            }


            /* Validasi file */

            if (file) {

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showFormMessage(
                        "Format foto harus JPG, PNG, atau WEBP.",
                        "error"
                    );

                    return;
                }


                /*
                 * Batas 3 MB.
                 *
                 * LocalStorage memiliki batas
                 * penyimpanan browser.
                 */

                if (
                    file.size >
                    3 * 1024 * 1024
                ) {

                    showFormMessage(
                        "Ukuran foto maksimal 3 MB.",
                        "error"
                    );

                    return;
                }
            }


            /* Loading */

            submitButton.disabled =
                true;

            submitButton.innerHTML =
                `
                <span>Mengirim...</span>
                <span>⏳</span>
                `;


            try {

                let photoData = null;


                /* Upload foto ke localStorage */

                if (file) {

                    photoData =
                        await fileToBase64(
                            file
                        );
                }


                /* Buat tiket */

                const ticket =
                    generateTicketNumber();


                const now =
                    new Date()
                    .toISOString();


                /* Data pengaduan */

                const complaint = {

                    id:
                        Date.now(),

                    ticketNumber:
                        ticket,

                    nama:
                        nama,

                    email:
                        email,

                    telepon:
                        telepon,

                    kategori:
                        kategori,

                    judul:
                        judul,

                    deskripsi:
                        deskripsi,

                    bukti:
                        photoData,

                    buktiNama:
                        file
                            ? file.name
                            : "",

                    status:
                        "Menunggu",

                    catatanAdmin:
                        "",

                    createdAt:
                        now,

                    updatedAt:
                        now,

                    history: [

                        {

                            status:
                                "Menunggu",

                            catatan:
                                "Pengaduan berhasil dibuat.",

                            tanggal:
                                now
                        }

                    ]

                };


                /* Ambil database */

                const complaints =
                    getComplaints();


                /* Simpan */

                complaints.push(
                    complaint
                );


                saveComplaints(
                    complaints
                );


                /* Simpan tiket terakhir */

                sessionStorage.setItem(
                    "lastTicket",
                    ticket
                );


                /* Tampilkan sukses */

                showSuccessTicket(
                    ticket
                );


                /* Reset form */

                complaintForm.reset();


                if (fileName) {

                    fileName.textContent =
                        "";
                }


            } catch (error) {

                console.error(
                    error
                );

                showFormMessage(
                    "Pengaduan gagal disimpan. Silakan coba lagi.",
                    "error"
                );

            } finally {

                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    `
                    <span>Kirim Pengaduan</span>
                    <span>→</span>
                    `;
            }

        }
    );
}


/* =========================================================
   PESAN FORM
   ========================================================= */

function showFormMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "formMessage"
        );

    if (!box) {
        return;
    }


    box.className =
        `form-message ${type}`;

    box.innerHTML =
        escapeHTML(message);
}


/* =========================================================
   SUCCESS TICKET
   ========================================================= */

function showSuccessTicket(
    ticket
) {

    const box =
        document.getElementById(
            "formMessage"
        );

    if (!box) {
        return;
    }


    box.className =
        "form-message success";


    box.innerHTML =
        `
        <strong>
            ✓ Pengaduan berhasil dikirim
        </strong>

        <br><br>

        Nomor tiket Anda:

        <div
            style="
                margin-top:10px;
                padding:13px;
                background:white;
                border-radius:10px;
                font-size:18px;
                font-weight:900;
                letter-spacing:1px;
                color:#0756a6;
                text-align:center;
            "
        >
            ${escapeHTML(ticket)}
        </div>

        <p
            style="
                margin:12px 0 0;
                font-size:12px;
            "
        >
            Simpan nomor tiket ini untuk
            mengecek status pengaduan Anda.
        </p>

        <a
            href="status.html?ticket=${encodeURIComponent(ticket)}"
            style="
                display:inline-block;
                margin-top:12px;
                color:#0756a6;
                font-weight:800;
            "
        >
            Cek Status Pengaduan →
        </a>
        `;
}


/* =========================================================
   FUNGSI PUBLIC
   ========================================================= */


/*
 * Cari pengaduan berdasarkan tiket.
 */

function findComplaint(
    ticket
) {

    const complaints =
        getComplaints();


    return complaints.find(
        item =>
            item.ticketNumber
                .toLowerCase()
            ===
            ticket
                .trim()
                .toLowerCase()
    );
}


/*
 * Cari berdasarkan tiket + email.
 */

function findComplaintByTicketAndEmail(
    ticket,
    email
) {

    const complaint =
        findComplaint(ticket);


    if (!complaint) {
        return null;
    }


    if (
        complaint.email
            .toLowerCase()
        !==
        email
            .trim()
            .toLowerCase()
    ) {

        return null;
    }


    return complaint;
}


/* =========================================================
   UPDATE PENGADUAN
   ========================================================= */

function updateComplaint(
    ticket,
    status,
    catatan
) {

    const complaints =
        getComplaints();


    const index =
        complaints.findIndex(
            item =>
                item.ticketNumber
                    .toLowerCase()
                ===
                ticket
                    .trim()
                    .toLowerCase()
        );


    if (index === -1) {

        return false;
    }


    const complaint =
        complaints[index];


    const now =
        new Date()
            .toISOString();


    const oldStatus =
        complaint.status;


    complaint.status =
        status;

    complaint.catatanAdmin =
        catatan;

    complaint.updatedAt =
        now;


    if (!Array.isArray(
        complaint.history
    )) {

        complaint.history = [];
    }


    complaint.history.push({

        status:
            status,

        catatan:
            catatan ||
            `Status diubah menjadi ${status}.`,

        tanggal:
            now

    });


    complaints[index] =
        complaint;


    saveComplaints(
        complaints
    );


    return true;
}


/* =========================================================
   DELETE DATA
   ========================================================= */

function deleteComplaint(
    ticket
) {

    const complaints =
        getComplaints();


    const filtered =
        complaints.filter(
            item =>
                item.ticketNumber
                !== ticket
        );


    saveComplaints(
        filtered
    );
}


/* =========================================================
   EXPORT DATA
   ========================================================= */

function exportComplaints() {

    const complaints =
        getComplaints();


    const data =
        JSON.stringify(
            complaints,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        `data-pengaduan-${new Date().toISOString().slice(0,10)}.json`;


    document.body.appendChild(
        link
    );

    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   DEBUG / TEST
   ========================================================= */

window.RuangKeluhan = {

    getComplaints:
        getComplaints,

    findComplaint:
        findComplaint,

    findComplaintByTicketAndEmail:
        findComplaintByTicketAndEmail,

    updateComplaint:
        updateComplaint,

    deleteComplaint:
        deleteComplaint,

    exportComplaints:
        exportComplaints

};
