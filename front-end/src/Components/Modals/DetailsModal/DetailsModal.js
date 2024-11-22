import React from "react";
import "./DetailsModal.css";
import ReactDOM from "react-dom";

function DetailsModal({children , selectedItem}) {

  return ReactDOM.createPortal(

    <div className="modal-parent active">
        {/* <div className="details-modal">{children}</div> */}
        <div className="details-modal">
        <h1 style={{borderBottom: "2px solid #000", fontSize: "18px", textAlign: "center"}}>جزییات اطلاعات {selectedItem}</h1>
          {children}
        </div>
    </div>,

    document.getElementById("modals-parent")
  )
}

export default DetailsModal;
