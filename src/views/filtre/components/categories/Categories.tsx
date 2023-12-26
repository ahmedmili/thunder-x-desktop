

import { useEffect, useRef, useState } from "react"
import "./categories.scss"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function Categories() {
    const [active, setActive] = useState("")
    const [collpased, setCollapse] = useState(false)
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef :any = useRef(null);
    
    const initialData = [
        {
            id: 1,
            name: "restaurant",
            show: true,
            childs: [
                {
                    id: 1,
                    name: "burger",
                    count: "8"
                },
                {
                    id: 2,
                    name: "Pizza",
                    count: "12"
                },
                {
                    id: 3,
                    name: "Tacos",
                    count: "9"
                },
                {
                    id: 4,
                    name: "Crepe",
                    count: "5"
                },
                {
                    id: 5,
                    name: "Sushi",
                    count: "8"
                },
                {
                    id: 6,
                    name: "Pasta",
                    count: "10"
                }                    
            ]
        },
        {
            id: 2,
            name: "Supermarché",
            show: false,
            childs: [
                {
                    id: 1,
                    name: "burger",
                    count: "8"
                },
                {
                    id: 2,
                    name: "Pizza",
                    count: "12"
                },
                {
                    id: 3,
                    name: "Tacos",
                    count: "9"
                },
                {
                    id: 4,
                    name: "Crepe",
                    count: "5"
                },
                {
                    id: 5,
                    name: "Sushi",
                    count: "8"
                },
                {
                    id: 6,
                    name: "Pasta",
                    count: "10"
                }                    
            ]
        }
    ]
    const [datas, setData] = useState(initialData);
    
    useEffect(() => {
        setContentHeight(contentRef?.current?.scrollHeight);
        setTimeout(() => {
            setContentHeight(contentRef?.current?.scrollHeight);
        }, 300); 
    }, [collpased,datas]);

    const toggleCategorie = (event: any, index: any) => {
        setData((prevData) => {  
            const newData : any = []
            prevData.map((item, i) => {
                let newVal;
                if (i == index) {
                    newVal = {
                        ...item,
                        show: !item.show,
                    }    
                }
                else {
                    newVal = {
                        ...item,
                    }                      
                }
                newData.push(newVal)                
            })
            return newData;
        });
    };
    const toggleCollapse = () => {        
        setCollapse(!collpased)
    }

    function clickHandle(searchQuery:string){
        setActive(searchQuery)
        // add api here when its ready
    }
    return (
        <div className="categories-filter-container">
            <h1 className={`categories-filter-container__title  ${collpased ? 'collapsed' : ''}`} >Catégories</h1>
            <ChevronRightIcon className={`categories-filter-container__collapse-icon  ${collpased ? 'close' : 'open'}`}  onClick={toggleCollapse}></ChevronRightIcon>
            <ul className={`categories-filter-container__list  ${collpased ? 'hide' : 'show'}`}  ref={contentRef} style={{ maxHeight: collpased ?  '0' : `${contentHeight}px`}}>
                {
                    datas.map((data, index) => {
                        return (                            
                            <li key={index} className="categories-filter-container__list__item">
                                <div className="form-check">
                                    <input className="radio-btn" type="radio" name="categorie" id={`category-check-${index}`} /> {/* Self-closing tag */}
                                    <label className={`form-label`} htmlFor={`category-check-${index}`}>
                                        {data.name}                                        
                                    </label>
                                    {data.childs.length && (
                                        <ChevronRightIcon className={`toggle-icon  ${data.show==true ? 'open' : 'close'}`} onClick={() => toggleCategorie(event,index)}></ChevronRightIcon>
                                    )}
                                </div>
                                { data.childs.length && (
                                    <ul className={`categories-filter-container__list categories-filter-container__list--sub ${data.show ? 'show' : 'hide'}`} style={{ height: `${data.show ? (data.childs.length)*39  : 0}px` }}>
                                        {data.childs.map((c, i) => {
                                            return (
                                                <li key={index+'-'+i} className="categories-filter-container__list__item categories-filter-container__list__item--sub">
                                                    <div className="form-check">
                                                        <input className="radio-btn" type="radio" name="categorie" id={`child-${index}-${i}`} />
                                                        <label className= {`form-label`} htmlFor={`child-${index}-${i}`}>
                                                            {c.name}
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>)}
                            </li>
                        )
                    })
                }
            </ul>

        </div>
    )
}

export default Categories