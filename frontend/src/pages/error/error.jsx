import "./error.css"
export const ErrorComponent = (props) => {
    return (
        <>
            <div className="lError">
                <p className="error-box">{props.message}</p>

            </div>
        </>
    )
}