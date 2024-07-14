document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('timeCapsuleForm');
    const timeCapsulesDiv = document.getElementById('timeCapsules');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const message = document.getElementById('message').value;
            const openDate = document.getElementById('openDate').value;

            if (message && openDate) {
                const timeCapsules = JSON.parse(localStorage.getItem('timeCapsules')) || [];
                timeCapsules.push({ message, openDate });
                localStorage.setItem('timeCapsules', JSON.stringify(timeCapsules));
                form.reset();
                alert('Time capsule saved!');
            } else {
                alert('Please fill in both fields.');
            }
        });
    }

    if (timeCapsulesDiv) {
        displayTimeCapsules();
    }

    deleteExpiredCapsules();  // Clean up expired capsules
});

function displayTimeCapsules() {
    const timeCapsulesDiv = document.getElementById('timeCapsules');
    const timeCapsules = JSON.parse(localStorage.getItem('timeCapsules')) || [];
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    timeCapsulesDiv.innerHTML = '';

    timeCapsules.forEach(capsule => {
        const openDate = new Date(capsule.openDate);
        const expiryDate = new Date(openDate);
        expiryDate.setDate(openDate.getDate() + 1); // Set expiry date to one day after the open date

        if (currentDate >= capsule.openDate && currentDate < expiryDate.toISOString().split('T')[0]) {
            const capsuleDiv = document.createElement('div');
            capsuleDiv.innerHTML = `
                <h3>Open Date: ${capsule.openDate}</h3>
                <p>Message: ${capsule.message}</p>
            `;
            timeCapsulesDiv.appendChild(capsuleDiv);
        }
    });
}

function deleteExpiredCapsules() {
    const timeCapsules = JSON.parse(localStorage.getItem('timeCapsules')) || [];
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const updatedTimeCapsules = timeCapsules.filter(capsule => {
        const openDate = new Date(capsule.openDate);
        const expiryDate = new Date(openDate);
        expiryDate.setDate(openDate.getDate() + 1); // Set expiry date to one day after the open date

        return currentDate < expiryDate.toISOString().split('T')[0];
    });

    if (updatedTimeCapsules.length !== timeCapsules.length) {
        localStorage.setItem('timeCapsules', JSON.stringify(updatedTimeCapsules));
        displayTimeCapsules();
    }
}
