import React from "react";

const DegistirilmeyenKart=(props)=>{
    const deneVeHataGöster=()=>{
        try{
            props.baslık="Yeni Başlık";
        }catch(hata){
            alert("Hata Yakalandı!Props Değiştirilemez"+hata.message);
        }
    }
    return(
        <div className="card">
            <h4 className="font-bold">{props.baslik}</h4>
            <p className="text-gray-500">Gelen Prop Değeri{props.baslik}</p>
            <button onClick={deneVeHataGöster} className="btn-red">Prop Değiştirmeyi Dene </button>
        </div>
    )
}

const Demo8ReadOnlyProps=()=>{
    return(
    <div className="p-4">
        <h3 className="text-xl font-bold">Demo 8: Salt Okunur(readonly)Props</h3>
        <div className="mt-4">
            <DegistirilmeyenKart baslik="Değiştirilmeyen Kart Başlık"/>
        </div>
    </div>
    )
};
export default Demo8ReadOnlyProps;