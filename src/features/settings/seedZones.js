// Helper script to seed city/zones into Firestore (run ad-hoc from app if needed)
import { db } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export async function seedDefaultZones() {
  const cityId = "Kyiv";
  const cityRef = doc(collection(db, "cities"), cityId);
  await setDoc(cityRef, { title: "Kyiv" }, { merge: true });

  const zones = [
    { id: "center", title: "Center", minOrder: 400, deliveryFee: 0, eta: "60-90m" },
    { id: "left-bank", title: "Left Bank", minOrder: 500, deliveryFee: 40, eta: "60-90m" },
    { id: "far", title: "Far Districts", minOrder: 700, deliveryFee: 80, eta: "90-120m" },
  ];

  for (const z of zones) {
    const zoneRef = doc(collection(db, "cities", cityId, "zones"), z.id);
    await setDoc(zoneRef, z, { merge: true });
  }
}


