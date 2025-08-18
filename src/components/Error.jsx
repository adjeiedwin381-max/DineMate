import Swal from 'sweetalert2';

export const handleError = (error) => {
    Swal.fire({ title: "Failed", text: error.message, icon: "error" });
};