import React from "react";

const Demo6ListRendering=()=>{
const dersler=[
    {id:101,ad:"Matematik"},
    {id:102,ad:"Fen"},
    {id:103,ad:"İngilizce"},
    {id:104,ad:"Almanca"},
];
return(
<div className="p-4">
    <h3 className="text-xl font-bold">Demo 6:Listeleme ve Key</h3>
    <div className="mt-4">
        <h4 className="font-bold">Ders Listesi</h4>
        <ul className="list-disc pl-5">
            {dersler.map((ders)=>(
                <li key={ders.id} className="p-1">
                    {ders.ad}(ID:{ders.id})
                </li>
            ))}
        </ul>
    </div>
</div>
)

}
export default Demo6ListRendering