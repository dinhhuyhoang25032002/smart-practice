import * as bcrypt from 'bcrypt';

export const hardData = async (password: string): Promise<string> => {
    return await bcrypt.genSalt(parseInt(`${process.env.SALT_ROUNDS}`))
        .then(async (salt) => {
            return await bcrypt.hash(password, salt);
        })
        .catch((e) => {
            throw new Error(e);
        })
};

export const compareData = async (password: string, hardPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hardPassword);
}