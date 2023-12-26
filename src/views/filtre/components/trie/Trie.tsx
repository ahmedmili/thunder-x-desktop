

import { useEffect, useRef, useState } from "react"
import "./trie.scss"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function Trie() {
    const [active, setActive] = useState("")
    const [collpased, setCollapse] = useState(false)
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef :any = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            setContentHeight(contentRef?.current?.scrollHeight);
        }, 300); 
    }, [collpased]);


    const lists = [
        {
            id: 1,
            name: "Offres du jour"
        },
        {
            id: 2,
            name: "Recommandé"
        },
        {
            id: 3,
            name: "Offre Premuim"
        },
        {
            id: 4,
            name: "Les plus populaires"
        },
        {
            id: 5,
            name: "Les mieux notés",
        },
    ]
    const toggleCollapse = () => {        
        setCollapse(!collpased)
    }


    function clickHandle(searchQuery: string) {
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="trie-filter-container">
            <h1 className="trie-filter-container__title"> Trier</h1>
            <ChevronRightIcon className={`trie-filter-container__collapse-icon  ${collpased ? 'close' : 'open'}`}  onClick={toggleCollapse}></ChevronRightIcon>
            <ul  className={`trie-filter-container__list  ${collpased ? 'hide' : 'show'}`}  ref={contentRef} style={{ maxHeight: collpased ?  '0' : `${contentHeight}px`}}>
                {
                    lists.map((data, index) => {
                        return (
                            <li key={index} className="trie-filter-container__list__item">
                                <div className="form-check" onClick={() => clickHandle(data.name)}>
                                    <input className="radio-btn" type="radio" name="trie" id={`flexRadioDefault${index}`} /> {/* Self-closing tag */}
                                    <label className= {`form-label`} htmlFor={`flexRadioDefault${index}`}>
                                        {data.name}
                                    </label>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Trie