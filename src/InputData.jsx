/* eslint-disable no-unused-vars */
import "./main.css"
import Menu from "./Menu";
import Header from "./Header";
import InputContent from "./InputContent";

const InputData = () => {
    return (
        <div>
            <Menu/>
            <div className="container-fluid px-5">
                <Header />
                <InputContent />
            </div>

        </div>
    );
};

export default InputData;