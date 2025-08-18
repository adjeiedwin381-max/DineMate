import Swal from 'sweetalert2';

export const errorHandler = (error) => Swal.fire({
    icon: 'error',
    title: 'Oops... Something went wrong!',
    text: error.message
});