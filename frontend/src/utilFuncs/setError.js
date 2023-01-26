import { setAlert } from "../redux/action/alertAction";

const setError = (id) =>{
    let msg = "Something went wrong, please try again. (errorid: -1)";

    switch (id){
        case 0:
            msg = "Error: Not Authorized ";
            break;
        case 1:
            msg = "Error Server";
            break;
        case 2:
            msg = "Pengguna Tidak Ditemukan";
            break;
        case 3:
            msg = "Object Tidak Ditemukan";
            break;
        case 4:
            msg = "The object could not be found due to an unexpected error.";
            break;
        case 5:
            msg = "Error: Some required fields are empty or invalid.";
            break;
        case 6:
            msg = "Error: An object does not have the complete information required.";
            break;
        case 7:
            msg = "Berhasil Dihapus";
            break;
        case 8:
            msg = "Error: The file could not be loaded.";
            break;
        case 9:
            msg = "Error: Object already exists.";
            break;
        default:
            break;
    }
    setAlert(msg, "danger");
};

export default setError;