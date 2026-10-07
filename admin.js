/* =========================================================
   RUANG KELUHAN KONSUMEN
   ADMIN.JS
   Versi tanpa Supabase
   ========================================================= */


/* =========================================================
   KONFIGURASI ADMIN
   ========================================================= */

/*
 * Untuk prototype/demo.
 *
 * Nanti kalau mau dibuat sistem online sungguhan,
 * login ini sebaiknya dipindahkan ke backend.
 */

const ADMIN_ACCOUNT = {
    email: "admin@ruangkeluhan.com",
    password: "admin123"
};


/* =========================================================
   ELEMENT
   ========================================================= */

const loginPage =
    document.getElementById(
        "loginPage"
    );

const dashboardPage =
    document.getElementById(
        "dashboardPage"
    );

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   SESSION ADMIN
   ========================================================= */

const ADMIN_SESSION_KEY =
    "ruang_keluhan_admin_login";


/* =========================================================
   CEK LOGIN
   ========================================================= */

function isAdminLoggedIn() {

    return (
        sessionStorage.getItem(
            ADMIN_SESSION_KEY
        ) === "true"
    );
}


/* =========================================================
   TAMPILKAN LOGIN / DASHBOARD
   ========================================================= */

function showLoginPage() {

    if (loginPage) {

        loginPage.style.display =
            "flex";
    }

    if (dashboardPage) {

        dashboardPage.style.display =
            "none";
    }
}


function showDashboard() {

    if (loginPage) {

        loginPage.style.display =
            "none";
    }

    if (dashboardPage) {

        dashboardPage.style.display =
            "block";
    }

    const emailDisplay =
        document.getElementById(
            "adminEmailDisplay"
        );

    if (emailDisplay) {

        emailDisplay.textContent =
            ADMIN_ACCOUNT.email;
    }


    loadDashboard();
}


/* =========================================================
   LOGIN
   ========================================================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "adminEmail"
                ).value
                .trim()
                .toLowerCase();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            hideLoginError();


            if (
                email ===
                    ADMIN_ACCOUNT.email
                    .toLowerCase()
                &&
                password ===
                    ADMIN_ACCOUNT.password
            ) {

                sessionStorage.setItem(
                    ADMIN_SESSION_KEY,
                    "true"
                );


                showDashboard();

            } else {

                showLoginError(
                    "Email atau password admin salah."
                );

            }

        }
    );

}


/* =========================================================
   LOGIN ERROR
   ========================================================= */

function showLoginError(
    message
) {

    if (!loginError) {
        return;
    }


    loginError.textContent =
        message;

    loginError.classList.add(
        "show"
    );
}


function hideLoginError() {

    if (!loginError) {
        return;
    }


    loginError.textContent =
        "";

    loginError.classList.remove(
        "show"
    );
}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                ADMIN_SESSION_KEY
            );

            showLoginPage();

        }
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function loadDashboard() {

    updateStatistics();

    renderRecentComplaints();

    renderAllComplaints();

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics() {

    const complaints =
        getComplaints();


    const total =
        complaints.length;


    const waiting =
        complaints.filter(
            item =>
                item.status ===
                "Menunggu"
        ).length;


    const process =
        complaints.filter(
            item =>
                item.status ===
                "Diproses"
        ).length;


    const done =
        complaints.filter(
            item =>
                item.status ===
                "Selesai"
        ).length;


    const totalElement =
        document.getElementById(
            "totalComplaints"
        );


    const waitingElement =
        document.getElementById(
            "waitingComplaints"
        );


    const processElement =
        document.getElementById(
            "processComplaints"
        );


    const doneElement =
        document.getElementById(
            "doneComplaints"
        );


    if (totalElement) {

        totalElement.textContent =
            total;
    }


    if (waitingElement) {

        waitingElement.textContent =
            waiting;
    }


    if (processElement) {

        processElement.textContent =
            process;
    }


    if (doneElement) {

        doneElement.textContent =
            done;
    }

}


/* =========================================================
   RECENT COMPLAINTS
   ========================================================= */

function renderRecentComplaints() {

    const container =
        document.getElementById(
            "recentComplaints"
        );


    if (!container) {
        return;
    }


    const complaints =
        getComplaints()
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            )
            .slice(0, 5);


    container.innerHTML =
        createComplaintsTable(
            complaints,
            true
        );

}


/* =========================================================
   ALL COMPLAINTS
   ========================================================= */

function renderAllComplaints() {

    const container =
        document.getElementById(
            "allComplaints"
        );


    if (!container) {
        return;
    }


    let complaints =
        getComplaints();


    const filter =
        document.getElementById(
            "statusFilter"
        );


    const selectedStatus =
        filter
            ? filter.value
            : "";


    if (selectedStatus) {

        complaints =
            complaints.filter(
                item =>
                    item.status ===
                    selectedStatus
            );

    }


    complaints.sort(
        (a, b) =>
            new Date(
                b.createdAt
            ) -
            new Date(
                a.createdAt
            )
    );


    container.innerHTML =
        createComplaintsTable(
            complaints,
            false
        );

}


/* =========================================================
   TABLE
   ========================================================= */

function createComplaintsTable(
    complaints,
    recentOnly
) {

    if (!complaints.length) {

        return `
            <div class="empty-table">

                <div class="empty-table-icon">
                    📭
                </div>

                <div>
                    Belum ada pengaduan.
                </div>

            </div>
        `;
    }


    let rows = "";


    complaints.forEach(
        function (item) {

            rows += `

                <tr>

                    <td>
                        <span class="ticket-cell">
                            ${escapeHTML(
                                item.ticketNumber
                            )}
                        </span>
                    </td>


                    <td>

                        <div
                            class="title-cell"
                            title="${escapeHTML(
                                item.judul
                            )}"
                        >
                            ${escapeHTML(
                                item.judul
                            )}
                        </div>

                    </td>


                    <td>
                        <span class="category-cell">
                            ${escapeHTML(
                                item.kategori
                            )}
                        </span>
                    </td>


                    <td>
                        ${escapeHTML(
                            item.nama
                        )}
                    </td>


                    <td>
                        ${getStatusBadge(
                            item.status
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            item.createdAt
                        )}
                    </td>


                    <td>

                        <button
                            class="detail-button"
                            onclick="openDetailModal('${encodeURIComponent(
                                item.ticketNumber
                            )}')"
                        >
                            Detail
                        </button>

                    </td>

                </tr>

            `;

        }
    );


    return `

        <table class="complaints-table">

            <thead>

                <tr>

                    <th>
                        Tiket
                    </th>

                    <th>
                        Pengaduan
                    </th>

                    <th>
                        Kategori
                    </th>

                    <th>
                        Pelapor
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Tanggal
                    </th>

                    <th>
                        Aksi
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}


/* =========================================================
   STATUS BADGE
   ========================================================= */

function getStatusBadge(
    status
) {

    const statusClass =
        status
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            );


    return `
        <span
            class="status-badge status-${statusClass}"
        >
            ${escapeHTML(status)}
        </span>
    `;
}


/* =========================================================
   NAVIGATION SECTION
   ========================================================= */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


menuItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const section =
                    this.dataset.section;


                showSection(
                    section
                );

            }
        );

    }
);


function showSection(
    section
) {

    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    const complaintSection =
        document.getElementById(
            "complaintSection"
        );


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    menuItems.forEach(
        function (item) {

            item.classList.toggle(
                "active",
                item.dataset.section ===
                    section
            );

        }
    );


    if (section === "dashboard") {

        dashboardSection.style.display =
            "block";

        complaintSection.style.display =
            "none";

        pageTitle.textContent =
            "Dashboard";


        loadDashboard();

    }


    if (section === "pengaduan") {

        dashboardSection.style.display =
            "none";

        complaintSection.style.display =
            "block";

        pageTitle.textContent =
            "Pengaduan";


        renderAllComplaints();

    }

}


/* =========================================================
   STATUS FILTER
   ========================================================= */

const statusFilter =
    document.getElementById(
        "statusFilter"
    );


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            renderAllComplaints();

        }
    );

}


/* =========================================================
   DETAIL MODAL
   ========================================================= */

let currentTicket = null;


function openDetailModal(
    encodedTicket
) {

    const ticket =
        decodeURIComponent(
            encodedTicket
        );


    const complaint =
        findComplaint(
            ticket
        );


    if (!complaint) {

        alert(
            "Data pengaduan tidak ditemukan."
        );

        return;
    }


    currentTicket =
        complaint.ticketNumber;


    /* Ticket */

    document.getElementById(
        "modalTicket"
    ).textContent =
        complaint.ticketNumber;


    /* Status */

    const statusElement =
        document.getElementById(
            "modalStatus"
        );


    statusElement.className =
        "status-badge";


    const statusClass =
        complaint.status
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            );


    statusElement.classList.add(
        `status-${statusClass}`
    );


    statusElement.textContent =
        complaint.status;


    /* Pelapor */

    document.getElementById(
        "modalNama"
    ).textContent =
        complaint.nama;


    document.getElementById(
        "modalEmail"
    ).textContent =
        complaint.email;


    document.getElementById(
        "modalTelepon"
    ).textContent =
        complaint.telepon;


    document.getElementById(
        "modalKategori"
    ).textContent =
        complaint.kategori;


    /* Pengaduan */

    document.getElementById(
        "modalJudul"
    ).textContent =
        complaint.judul;


    document.getElementById(
        "modalDeskripsi"
    ).textContent =
        complaint.deskripsi;


    /* Status update */

    document.getElementById(
        "updateStatus"
    ).value =
        complaint.status;


    document.getElementById(
        "updateNote"
    ).value =
        complaint.catatanAdmin ||
        "";


    /* Bukti */

    renderEvidence(
        complaint
    );


    /* History */

    renderModalHistory(
        complaint
    );


    /* Modal */

    document.getElementById(
        "detailModal"
    ).classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeDetailModal() {

    const modal =
        document.getElementById(
            "detailModal"
        );


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

    currentTicket = null;

}


/* Close when clicking overlay */

const detailModal =
    document.getElementById(
        "detailModal"
    );


if (detailModal) {

    detailModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                detailModal
            ) {

                closeDetailModal();

            }

        }
    );

}


/* =========================================================
   EVIDENCE
   ========================================================= */

function renderEvidence(
    complaint
) {

    const container =
        document.getElementById(
            "evidenceContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        !complaint.bukti
    ) {

        container.innerHTML =
            `
            <div class="evidence-empty">
                Tidak ada foto bukti yang dilampirkan.
            </div>
            `;

        return;
    }


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "evidence-image";


    image.src =
        complaint.bukti;


    image.alt =
        complaint.buktiNama ||
        "Bukti pengaduan";


    container.appendChild(
        image
    );


    const link =
        document.createElement(
            "a"
        );


    link.className =
        "evidence-link";


    link.href =
        complaint.bukti;


    link.target =
        "_blank";


    link.rel =
        "noopener noreferrer";


    link.textContent =
        "↗ Buka Foto di Tab Baru";


    container.appendChild(
        link
    );

}


/* =========================================================
   HISTORY
   ========================================================= */

function renderModalHistory(
    complaint
) {

    const container =
        document.getElementById(
            "modalHistory"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const history =
        Array.isArray(
            complaint.history
        )
            ? complaint.history
            : [];


    if (!history.length) {

        container.innerHTML =
            `
            <div class="evidence-empty">
                Belum ada riwayat.
            </div>
            `;

        return;
    }


    history
        .slice()
        .reverse()
        .forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "modal-history-item";


                div.innerHTML =
                    `

                    <span
                        class="modal-history-dot"
                    ></span>

                    <strong>
                        ${escapeHTML(
                            item.status
                        )}
                    </strong>

                    <div
                        class="modal-history-date"
                    >
                        ${formatDate(
                            item.tanggal
                        )}
                    </div>

                    ${
                        item.catatan
                        ? `
                        <div
                            class="modal-history-note"
                        >
                            ${escapeHTML(
                                item.catatan
                            )}
                        </div>
                        `
                        : ""
                    }

                    `;


                container.appendChild(
                    div
                );

            }
        );

}


/* =========================================================
   SAVE ADMIN UPDATE
   ========================================================= */

const saveUpdateButton =
    document.getElementById(
        "saveUpdateButton"
    );


if (saveUpdateButton) {

    saveUpdateButton.addEventListener(
        "click",
        function () {

            if (!currentTicket) {

                return;
            }


            const newStatus =
                document.getElementById(
                    "updateStatus"
                ).value;


            const note =
                document.getElementById(
                    "updateNote"
                ).value.trim();


            const success =
                updateComplaint(
                    currentTicket,
                    newStatus,
                    note
                );


            if (!success) {

                alert(
                    "Gagal menyimpan perubahan."
                );

                return;
            }


            alert(
                "Perubahan berhasil disimpan."
            );


            const updatedComplaint =
                findComplaint(
                    currentTicket
                );


            if (updatedComplaint) {

                renderEvidence(
                    updatedComplaint
                );

                renderModalHistory(
                    updatedComplaint
                );


                const statusElement =
                    document.getElementById(
                        "modalStatus"
                    );


                statusElement.className =
                    "status-badge";


                const statusClass =
                    updatedComplaint.status
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        );


                statusElement.classList.add(
                    `status-${statusClass}`
                );


                statusElement.textContent =
                    updatedComplaint.status;

            }


            loadDashboard();

        }
    );

}


/* =========================================================
   EXPORT
   ========================================================= */

const exportButton =
    document.getElementById(
        "exportButton"
    );


if (exportButton) {

    exportButton.addEventListener(
        "click",
        function () {

            exportComplaints();

        }
    );

}


/* =========================================================
   ESC KEY MODAL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeDetailModal();

        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

if (isAdminLoggedIn()) {

    showDashboard();

} else {

    showLoginPage();

}
