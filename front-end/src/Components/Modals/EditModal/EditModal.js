import React from "react";
import "./EditModal.css";
import ReactDOM from "react-dom";

function EditModal({children , editModalAcceptHandler, editModalRejectHandler, editModalTitle, editModalYesBtn, editModalNoBtn}) {

  return ReactDOM.createPortal(

    <div className="modal-parent active">
      <form className="edit-modal-form">
        <h1 style={{borderBottom: "2px solid #000", fontSize: "18px"}}>{editModalTitle}</h1>
        {children}
        <button className="edit-form-submit" onClick={editModalAcceptHandler}>
          {editModalYesBtn}
        </button>
        <button className="edit-form-submit" onClick={editModalRejectHandler}>
          {editModalNoBtn}
        </button>
      </form>
    </div>,

    document.getElementById("modals-parent")
  )
}

export default EditModal;
