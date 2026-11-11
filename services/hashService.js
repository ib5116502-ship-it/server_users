import bcrypt from "bcrypt";

class HashService {
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);

      

      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (err) {
      throw new Error("Ошибка при хэшировании пароля");
    }
  }

  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      throw new Error("Ошибка при сравнении паролей");
    }
  }
}
export default new HashService();







function abc(array){

  for(let i = 0 ; i < array.length; i++){
    
  }

}
let arr =[1,2,3,4]
abc(arr)