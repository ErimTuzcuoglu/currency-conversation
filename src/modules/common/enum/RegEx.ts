export class RegEx {
  public static readonly EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  public static readonly GUID =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
}
