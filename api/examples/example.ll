; ModuleID = 'example.c'
source_filename = "example.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

%struct.IntArray = type { i32*, i32 }

@.str = private unnamed_addr constant [4 x i8] c"%d \00", align 1
@.str.1 = private unnamed_addr constant [2 x i8] c"n\00", align 1

; Function Attrs: noinline nounwind optnone uwtable
define dso_local %struct.IntArray* @createIntArray(i32 noundef %size) #0 !dbg !10 {
entry:
  %size.addr = alloca i32, align 4
  %arr = alloca %struct.IntArray*, align 8
  %i = alloca i32, align 4
  store i32 %size, i32* %size.addr, align 4
  call void @llvm.dbg.declare(metadata i32* %size.addr, metadata !22, metadata !DIExpression()), !dbg !23
  call void @llvm.dbg.declare(metadata %struct.IntArray** %arr, metadata !24, metadata !DIExpression()), !dbg !25
  %call = call noalias i8* @malloc(i64 noundef 16) #4, !dbg !26
  %0 = bitcast i8* %call to %struct.IntArray*, !dbg !26
  store %struct.IntArray* %0, %struct.IntArray** %arr, align 8, !dbg !25
  %1 = load i32, i32* %size.addr, align 4, !dbg !27
  %2 = load %struct.IntArray*, %struct.IntArray** %arr, align 8, !dbg !28
  %size1 = getelementptr inbounds %struct.IntArray, %struct.IntArray* %2, i32 0, i32 1, !dbg !29
  store i32 %1, i32* %size1, align 8, !dbg !30
  %3 = load i32, i32* %size.addr, align 4, !dbg !31
  %conv = sext i32 %3 to i64, !dbg !31
  %mul = mul i64 %conv, 4, !dbg !32
  %call2 = call noalias i8* @malloc(i64 noundef %mul) #4, !dbg !33
  %4 = bitcast i8* %call2 to i32*, !dbg !33
  %5 = load %struct.IntArray*, %struct.IntArray** %arr, align 8, !dbg !34
  %data = getelementptr inbounds %struct.IntArray, %struct.IntArray* %5, i32 0, i32 0, !dbg !35
  store i32* %4, i32** %data, align 8, !dbg !36
  call void @llvm.dbg.declare(metadata i32* %i, metadata !37, metadata !DIExpression()), !dbg !39
  store i32 0, i32* %i, align 4, !dbg !39
  br label %for.cond, !dbg !40

for.cond:                                         ; preds = %for.inc, %entry
  %6 = load i32, i32* %i, align 4, !dbg !41
  %7 = load i32, i32* %size.addr, align 4, !dbg !43
  %cmp = icmp slt i32 %6, %7, !dbg !44
  br i1 %cmp, label %for.body, label %for.end, !dbg !45

for.body:                                         ; preds = %for.cond
  %8 = load i32, i32* %i, align 4, !dbg !46
  %9 = load %struct.IntArray*, %struct.IntArray** %arr, align 8, !dbg !48
  %data4 = getelementptr inbounds %struct.IntArray, %struct.IntArray* %9, i32 0, i32 0, !dbg !49
  %10 = load i32*, i32** %data4, align 8, !dbg !49
  %11 = load i32, i32* %i, align 4, !dbg !50
  %idxprom = sext i32 %11 to i64, !dbg !48
  %arrayidx = getelementptr inbounds i32, i32* %10, i64 %idxprom, !dbg !48
  store i32 %8, i32* %arrayidx, align 4, !dbg !51
  br label %for.inc, !dbg !52

for.inc:                                          ; preds = %for.body
  %12 = load i32, i32* %i, align 4, !dbg !53
  %inc = add nsw i32 %12, 1, !dbg !53
  store i32 %inc, i32* %i, align 4, !dbg !53
  br label %for.cond, !dbg !54, !llvm.loop !55

for.end:                                          ; preds = %for.cond
  %13 = load %struct.IntArray*, %struct.IntArray** %arr, align 8, !dbg !58
  ret %struct.IntArray* %13, !dbg !59
}

; Function Attrs: nofree nosync nounwind readnone speculatable willreturn
declare void @llvm.dbg.declare(metadata, metadata, metadata) #1

; Function Attrs: nounwind
declare noalias i8* @malloc(i64 noundef) #2

; Function Attrs: noinline nounwind optnone uwtable
define dso_local void @useIntArray(%struct.IntArray* noundef %arr) #0 !dbg !60 {
entry:
  %arr.addr = alloca %struct.IntArray*, align 8
  %i = alloca i32, align 4
  store %struct.IntArray* %arr, %struct.IntArray** %arr.addr, align 8
  call void @llvm.dbg.declare(metadata %struct.IntArray** %arr.addr, metadata !63, metadata !DIExpression()), !dbg !64
  call void @llvm.dbg.declare(metadata i32* %i, metadata !65, metadata !DIExpression()), !dbg !67
  store i32 0, i32* %i, align 4, !dbg !67
  br label %for.cond, !dbg !68

for.cond:                                         ; preds = %for.inc, %entry
  %0 = load i32, i32* %i, align 4, !dbg !69
  %1 = load %struct.IntArray*, %struct.IntArray** %arr.addr, align 8, !dbg !71
  %size = getelementptr inbounds %struct.IntArray, %struct.IntArray* %1, i32 0, i32 1, !dbg !72
  %2 = load i32, i32* %size, align 8, !dbg !72
  %cmp = icmp slt i32 %0, %2, !dbg !73
  br i1 %cmp, label %for.body, label %for.end, !dbg !74

for.body:                                         ; preds = %for.cond
  %3 = load %struct.IntArray*, %struct.IntArray** %arr.addr, align 8, !dbg !75
  %data = getelementptr inbounds %struct.IntArray, %struct.IntArray* %3, i32 0, i32 0, !dbg !77
  %4 = load i32*, i32** %data, align 8, !dbg !77
  %5 = load i32, i32* %i, align 4, !dbg !78
  %idxprom = sext i32 %5 to i64, !dbg !75
  %arrayidx = getelementptr inbounds i32, i32* %4, i64 %idxprom, !dbg !75
  %6 = load i32, i32* %arrayidx, align 4, !dbg !75
  %call = call i32 (i8*, ...) @printf(i8* noundef getelementptr inbounds ([4 x i8], [4 x i8]* @.str, i64 0, i64 0), i32 noundef %6), !dbg !79
  br label %for.inc, !dbg !80

for.inc:                                          ; preds = %for.body
  %7 = load i32, i32* %i, align 4, !dbg !81
  %inc = add nsw i32 %7, 1, !dbg !81
  store i32 %inc, i32* %i, align 4, !dbg !81
  br label %for.cond, !dbg !82, !llvm.loop !83

for.end:                                          ; preds = %for.cond
  %call1 = call i32 (i8*, ...) @printf(i8* noundef getelementptr inbounds ([2 x i8], [2 x i8]* @.str.1, i64 0, i64 0)), !dbg !85
  ret void, !dbg !86
}

declare i32 @printf(i8* noundef, ...) #3

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @main() #0 !dbg !87 {
entry:
  %retval = alloca i32, align 4
  %array1 = alloca %struct.IntArray*, align 8
  %array2 = alloca %struct.IntArray*, align 8
  store i32 0, i32* %retval, align 4
  call void @llvm.dbg.declare(metadata %struct.IntArray** %array1, metadata !90, metadata !DIExpression()), !dbg !91
  %call = call %struct.IntArray* @createIntArray(i32 noundef 5), !dbg !92
  store %struct.IntArray* %call, %struct.IntArray** %array1, align 8, !dbg !91
  call void @llvm.dbg.declare(metadata %struct.IntArray** %array2, metadata !93, metadata !DIExpression()), !dbg !94
  %call1 = call %struct.IntArray* @createIntArray(i32 noundef 10), !dbg !95
  store %struct.IntArray* %call1, %struct.IntArray** %array2, align 8, !dbg !94
  %0 = load %struct.IntArray*, %struct.IntArray** %array1, align 8, !dbg !96
  call void @useIntArray(%struct.IntArray* noundef %0), !dbg !97
  %1 = load %struct.IntArray*, %struct.IntArray** %array2, align 8, !dbg !98
  call void @useIntArray(%struct.IntArray* noundef %1), !dbg !99
  ret i32 0, !dbg !100
}

attributes #0 = { noinline nounwind optnone uwtable "frame-pointer"="all" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #1 = { nofree nosync nounwind readnone speculatable willreturn }
attributes #2 = { nounwind "frame-pointer"="all" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #3 = { "frame-pointer"="all" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #4 = { nounwind }

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2, !3, !4, !5, !6, !7, !8}
!llvm.ident = !{!9}

!0 = distinct !DICompileUnit(language: DW_LANG_C99, file: !1, producer: "Ubuntu clang version 14.0.0-1ubuntu1.1", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug, splitDebugInlining: false, nameTableKind: None)
!1 = !DIFile(filename: "example.c", directory: "/home/josy/capstoneProject2024/api", checksumkind: CSK_MD5, checksum: "a22cf963aa3298c69323a0c1cffc982f")
!2 = !{i32 7, !"Dwarf Version", i32 5}
!3 = !{i32 2, !"Debug Info Version", i32 3}
!4 = !{i32 1, !"wchar_size", i32 4}
!5 = !{i32 7, !"PIC Level", i32 2}
!6 = !{i32 7, !"PIE Level", i32 2}
!7 = !{i32 7, !"uwtable", i32 1}
!8 = !{i32 7, !"frame-pointer", i32 2}
!9 = !{!"Ubuntu clang version 14.0.0-1ubuntu1.1"}
!10 = distinct !DISubprogram(name: "createIntArray", scope: !1, file: !1, line: 9, type: !11, scopeLine: 9, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !21)
!11 = !DISubroutineType(types: !12)
!12 = !{!13, !19}
!13 = !DIDerivedType(tag: DW_TAG_pointer_type, baseType: !14, size: 64)
!14 = !DIDerivedType(tag: DW_TAG_typedef, name: "IntArray", file: !1, line: 7, baseType: !15)
!15 = distinct !DICompositeType(tag: DW_TAG_structure_type, file: !1, line: 4, size: 128, elements: !16)
!16 = !{!17, !20}
!17 = !DIDerivedType(tag: DW_TAG_member, name: "data", scope: !15, file: !1, line: 5, baseType: !18, size: 64)
!18 = !DIDerivedType(tag: DW_TAG_pointer_type, baseType: !19, size: 64)
!19 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!20 = !DIDerivedType(tag: DW_TAG_member, name: "size", scope: !15, file: !1, line: 6, baseType: !19, size: 32, offset: 64)
!21 = !{}
!22 = !DILocalVariable(name: "size", arg: 1, scope: !10, file: !1, line: 9, type: !19)
!23 = !DILocation(line: 9, column: 30, scope: !10)
!24 = !DILocalVariable(name: "arr", scope: !10, file: !1, line: 10, type: !13)
!25 = !DILocation(line: 10, column: 15, scope: !10)
!26 = !DILocation(line: 10, column: 21, scope: !10)
!27 = !DILocation(line: 11, column: 17, scope: !10)
!28 = !DILocation(line: 11, column: 5, scope: !10)
!29 = !DILocation(line: 11, column: 10, scope: !10)
!30 = !DILocation(line: 11, column: 15, scope: !10)
!31 = !DILocation(line: 12, column: 24, scope: !10)
!32 = !DILocation(line: 12, column: 29, scope: !10)
!33 = !DILocation(line: 12, column: 17, scope: !10)
!34 = !DILocation(line: 12, column: 5, scope: !10)
!35 = !DILocation(line: 12, column: 10, scope: !10)
!36 = !DILocation(line: 12, column: 15, scope: !10)
!37 = !DILocalVariable(name: "i", scope: !38, file: !1, line: 13, type: !19)
!38 = distinct !DILexicalBlock(scope: !10, file: !1, line: 13, column: 5)
!39 = !DILocation(line: 13, column: 14, scope: !38)
!40 = !DILocation(line: 13, column: 10, scope: !38)
!41 = !DILocation(line: 13, column: 21, scope: !42)
!42 = distinct !DILexicalBlock(scope: !38, file: !1, line: 13, column: 5)
!43 = !DILocation(line: 13, column: 25, scope: !42)
!44 = !DILocation(line: 13, column: 23, scope: !42)
!45 = !DILocation(line: 13, column: 5, scope: !38)
!46 = !DILocation(line: 14, column: 24, scope: !47)
!47 = distinct !DILexicalBlock(scope: !42, file: !1, line: 13, column: 36)
!48 = !DILocation(line: 14, column: 9, scope: !47)
!49 = !DILocation(line: 14, column: 14, scope: !47)
!50 = !DILocation(line: 14, column: 19, scope: !47)
!51 = !DILocation(line: 14, column: 22, scope: !47)
!52 = !DILocation(line: 15, column: 5, scope: !47)
!53 = !DILocation(line: 13, column: 32, scope: !42)
!54 = !DILocation(line: 13, column: 5, scope: !42)
!55 = distinct !{!55, !45, !56, !57}
!56 = !DILocation(line: 15, column: 5, scope: !38)
!57 = !{!"llvm.loop.mustprogress"}
!58 = !DILocation(line: 16, column: 12, scope: !10)
!59 = !DILocation(line: 16, column: 5, scope: !10)
!60 = distinct !DISubprogram(name: "useIntArray", scope: !1, file: !1, line: 19, type: !61, scopeLine: 19, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !21)
!61 = !DISubroutineType(types: !62)
!62 = !{null, !13}
!63 = !DILocalVariable(name: "arr", arg: 1, scope: !60, file: !1, line: 19, type: !13)
!64 = !DILocation(line: 19, column: 28, scope: !60)
!65 = !DILocalVariable(name: "i", scope: !66, file: !1, line: 21, type: !19)
!66 = distinct !DILexicalBlock(scope: !60, file: !1, line: 21, column: 5)
!67 = !DILocation(line: 21, column: 14, scope: !66)
!68 = !DILocation(line: 21, column: 10, scope: !66)
!69 = !DILocation(line: 21, column: 21, scope: !70)
!70 = distinct !DILexicalBlock(scope: !66, file: !1, line: 21, column: 5)
!71 = !DILocation(line: 21, column: 25, scope: !70)
!72 = !DILocation(line: 21, column: 30, scope: !70)
!73 = !DILocation(line: 21, column: 23, scope: !70)
!74 = !DILocation(line: 21, column: 5, scope: !66)
!75 = !DILocation(line: 22, column: 23, scope: !76)
!76 = distinct !DILexicalBlock(scope: !70, file: !1, line: 21, column: 41)
!77 = !DILocation(line: 22, column: 28, scope: !76)
!78 = !DILocation(line: 22, column: 33, scope: !76)
!79 = !DILocation(line: 22, column: 9, scope: !76)
!80 = !DILocation(line: 23, column: 5, scope: !76)
!81 = !DILocation(line: 21, column: 37, scope: !70)
!82 = !DILocation(line: 21, column: 5, scope: !70)
!83 = distinct !{!83, !74, !84, !57}
!84 = !DILocation(line: 23, column: 5, scope: !66)
!85 = !DILocation(line: 24, column: 5, scope: !60)
!86 = !DILocation(line: 25, column: 1, scope: !60)
!87 = distinct !DISubprogram(name: "main", scope: !1, file: !1, line: 27, type: !88, scopeLine: 27, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !21)
!88 = !DISubroutineType(types: !89)
!89 = !{!19}
!90 = !DILocalVariable(name: "array1", scope: !87, file: !1, line: 28, type: !13)
!91 = !DILocation(line: 28, column: 15, scope: !87)
!92 = !DILocation(line: 28, column: 24, scope: !87)
!93 = !DILocalVariable(name: "array2", scope: !87, file: !1, line: 29, type: !13)
!94 = !DILocation(line: 29, column: 15, scope: !87)
!95 = !DILocation(line: 29, column: 24, scope: !87)
!96 = !DILocation(line: 31, column: 17, scope: !87)
!97 = !DILocation(line: 31, column: 5, scope: !87)
!98 = !DILocation(line: 32, column: 17, scope: !87)
!99 = !DILocation(line: 32, column: 5, scope: !87)
!100 = !DILocation(line: 36, column: 5, scope: !87)
