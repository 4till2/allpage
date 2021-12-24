import ReactModal from 'react-modal'

export default function Modal({children, onExit, isOpen}) {
    return (
        <ReactModal onRequestClose={onExit}
                    isOpen={isOpen}
                    preventScroll={true}
                    overlayClassName={"block fixed flex top-0 bottom-0 left-0 right-0 h-screen z-20 p-8 backdrop-blur-xl transition-all"}
                    className={"m-auto p-8 bg-gray-50 rounded ring ring-gray-200 shadow-lg focus:outline-none "}
        >
            {children}
        </ReactModal>
    )
}
