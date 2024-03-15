import React from 'react';

const ModalBackground = ({children})=>{
    return(
    <div
      style={{
        background: "rgb(0 0 0 / 28%)",
      }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[12]"
    >{children}</div>
    )
}
export default ModalBackground;
