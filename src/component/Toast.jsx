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
    }, [messages, dispatch])

    return(<div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
        {/* 將DOM元素(el)存進id */}
        {messages.map(msg => (
            <div ref={(el) => toastRefs.current[msg.id] = el} 
                className="toast mb-2 border-0" role="alert" aria-live="assertive" aria-atomic="true" key={msg.id}>
                <div className={`toast-header text-white border-0`}
                    style={{ backgroundColor: `${msg.type === 'success' ? '#E69270' : '#D2501B'}` }}>
                    <strong className="me-auto"
                        style={{color:`${msg.type === 'success' ? '#fff' : '#fff'}`}}>{msg.title}</strong>
                    <button
                        type="button"
                        className="btn bg-none text-white p-0 d-flex align-content-center"
                        data-bs-dismiss='toast'
                        aria-label="Close"
                        ><span class="material-icons align-self-center">close</span></button>
                </div>
                <div className="toast-body">{msg.text}</div>
            </div>
        ))}
    </div>
    )
}