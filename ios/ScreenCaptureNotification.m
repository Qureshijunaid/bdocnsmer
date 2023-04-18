#import <Foundation/Foundation.h>
#import "ScreenCaptureNotification.h"
#import <React/RCTLog.h>
@implementation ScreenCaptureNotification

+ (id)allocWithZone:(NSZone *)zone {
  static ScreenCaptureNotification *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"isScreenCaptureEnabled"];
}

-(void) isScreenCaptureEnabled:(BOOL)isCaptured {
  [self sendEventWithName:@"isScreenCaptureEnabled" body:@{@"value": @(isCaptured)}];
}

@end
