import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Toast as BsToast } from "bootstrap";
import { removeMessage } from "../redux/toastSlice";

export default function Toast() {
    const messages = useSelector(state => state.toast.messages)
    const dispatch = useDispatch();
    const toastRefs = useRef({}); //預期：{ id1: toastDOM1, id2:toastDOM2}


    useEffect(() => {
        //讓每個toast都建立一個實例
        messages.forEach(msg => {
            const messageElement = toastRefs.current[msg.id];
            if (messageElement) {
                const toastInstance = new BsToast(messageElement);
                toastInstance.show();

                setTimeout(() => {
                    dispatch(removeMessage(msg.id))
                }, 3000)
            }
        })
    }, [messages])

    return(<div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
        {/* 將DOM元素(el)存進id */}
        {messages.map(msg => (
            <div ref={(el) => toastRefs.current[msg.id] = el} 
                className="toast mb-2" role="alert" aria-live="assertive" aria-atomic="true" key={msg.id}>
                <div className={`toast-header text-white`}
                    style={{ backgroundColor: `${msg.type === 'success' ? '#47b966' : '#e04c10'}` }}>
                    <strong className="me-auto">{msg.title}</strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss='toast'
                        aria-label="Close"
                        ></button>
                </div>
                <div className="toast-body">{msg.text}</div>
            </div>
        ))}
    </div>
    )
}