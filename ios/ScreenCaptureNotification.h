#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#ifndef ScreenCaptureNotification_h
#define ScreenCaptureNotification_h


@interface ScreenCaptureNotification : RCTEventEmitter <RCTBridgeModule>
-(void) isScreenCaptureEnabled:(BOOL)isCaptured;
@end

#endif /* ScreenCaptureNotification_h */
