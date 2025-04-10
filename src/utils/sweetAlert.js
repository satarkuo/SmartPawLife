import Swal from 'sweetalert2';

//sweetalert
const ToastAlert = Swal.mixin({
  toast: true, // 設為小提示
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    title: 'textBody3',
    popup: 'rounded-4 ',
    container: 'custom-zindex-2000',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const ConfirmAlert = Swal.mixin({
  toast: false, // 設為彈窗
  position: 'center',
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: '確定',
  cancelButtonText: '取消',
  reverseButtons: true,
  customClass: {
    title: 'h6',
    confirmButton: 'btn btn-delete-outline',
    cancelButton: 'btn btn-secondary',
    icon: 'text-danger border-danger',
    container: 'bg-primary bg-opacity-75',
    popup: 'rounded-4',
  },
});

export { ToastAlert, ConfirmAlert };
