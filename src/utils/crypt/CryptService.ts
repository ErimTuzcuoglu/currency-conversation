import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { Repository } from 'typeorm';
/* #region Local Imports */
import { User } from '@modules/user/entities/user.entity';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';
/* #endregion */

@Injectable()
export class CryptService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  getCryptPasswordAndIV() {
    return {
      cryptPassword: this.configService.get(EnvironmentVariables.CRYPT_PASS),
      iv: randomBytes(16),
    };
  }

  async encrypt(text: string): Promise<string> {
    // const iv: Buffer = randomBytes(16);

    const cryptPassAndIv = this.getCryptPasswordAndIV();

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key: Buffer = (await promisify(scrypt)(
      cryptPassAndIv.cryptPassword,
      'salt',
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, cryptPassAndIv.iv);

    return Buffer.concat([cipher.update(text), cipher.final()]).toString();
  }

  async decrypt(encrypted: string): Promise<string> {
    const cryptPassAndIv = this.getCryptPasswordAndIV();
    const decipher = createDecipheriv(
      'aes-256-ctr',
      cryptPassAndIv.cryptPassword,
      cryptPassAndIv.iv,
    );
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encrypted)),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }
}
