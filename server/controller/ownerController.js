import { Owner } from "../models/Owner.js";
import { OwnerRouter } from "../routes/owner.js";


export const CreateOnwer=async(req,res)=>{
    try{

        const {name,email,phone,carNumber,unitNumber}=req.body;
        
       
        const data=await Owner.create({
            name,email,carNumber,phone,unitNumber
        });
          res.json({success:true,data:data,message:"owner addedd successfully"})     

    }catch(error){
         console.log(error.message);
            return res.json({ success: false, message: error.message });
    }
}

export const DeleteOwner = async (req, res) => {
  try {
    
    const { id } = req.params;

    // 2. البحث والحذف
    const deletedOwner = await Owner.findByIdAndDelete(id);

    // 3. التأكد أن المالك كان موجوداً أصلاً قبل الحذف
    if (!deletedOwner) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    return res.status(200).json({ success: true, message: "Owner deleted successfully" });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateOwner = async (req, res) => {
  try {
    const { name, email, phone, carNumber, unitNumber, id } = req.body;

    const updatedData = await Owner.findOneAndUpdate(
      { _id: id }, 
      { name, email, phone, carNumber, unitNumber },
      { new: true } 
    );
    if (!updatedData) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }

    return res.status(200).json({ success: true, message: "Owner updated successfully", data: updatedData });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const verifyQRCode = async (req, res) => {
  try {
    // 1. جلب الـ ID المرسل من الـ QR
    const { id } = req.params;

    // 2. البحث عنه في الداتابيز
    const owner = await Owner.findById(id);

    if (!owner) {
      return res.status(404).json({ success: false, message: "هذا التصريح غير موجود بالسيستم" });
    }

    // 3. التأكد إن حسابه نشط ومسموح له بالدخول
    if (owner.status !== 'Active') {
      return res.status(403).json({ success: false, message: "دخول مرفوض! الحساب غير نشط" });
    }

    // 4. إذا كل شيء تمام
    res.status(200).json({ 
      success: true, 
      message: "تم السماح بالدخول بنجاح", 
      ownerName: owner.name,
      unit: owner.unit 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const FetchOwner=async(req,res)=>{
  try{

      const Owners=await Owner.find({});

         res.json({success:true,data:Owners})
   
  }catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}