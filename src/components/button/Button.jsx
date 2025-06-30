import React from "react";
import "./Button.css";

function Button({ title, type, isDisabled, action, buttonType }) {
  return (
    <div className="button">
      <button
        type={buttonType}
        className={type}
        disabled={isDisabled}
        onClick={action}
      >
        {title}
      </button>
    </div>
  );
}

export default Button;
