export function DecorateAll(decorator: MethodDecorator) {
  return (target: any) => {
    const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value == 'function' && propName != 'constructor';
      if (!isMethod) {
        continue;
      }
      decorator(target, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}
